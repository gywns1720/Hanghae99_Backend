import { IFindOneItem, ITransaction, IUpdateItem } from '@lib/common/type';
import { UserProfileEntity } from '@lib/e-commerce/mysql/entities';
import { ChargePointCommand } from '@lib/e-commerce/user/command';
import { CommonPointCaseDto } from '@lib/e-commerce/user/case/common-point-case.dto';
import { UserError } from '@lib/e-commerce/user/user.error';

export default class ChargePointUseCase {
  constructor(
    protected readonly userRepo: IUpdateItem<UserProfileEntity> &
      IFindOneItem<UserProfileEntity> &
      ITransaction,
  ) {}

  async execute(data: CommonPointCaseDto | ChargePointCommand) {
    if (this._isPointCommand(data)) {
      await this._chargePointCommand(data);
    } else {
      await this._chargePointDto(data);
    }
  }

  private async _chargePointCommand(data: ChargePointCommand) {
    await this.retryPointCharge(data);
    // //  동시성 문제 발생 100% Lock 필요
    // await this.userRepo.updateItem(data.userProfile.id, {
    //   ...data.userProfile,
    //   point: data.userProfile.point + data.domain.amount,
    // });
  }

  /**
   *
   * @param data
   * @private
   * @throws UserError
   */
  private async _chargePointDto(data: CommonPointCaseDto) {
    const myUser = await this.userRepo.findOneItem(data.id);
    if (!myUser) {
      throw UserError.NotFoundUser();
    }

    await this.retryPointCharge(data);
  }

  private _isPointCommand(
    item: CommonPointCaseDto | ChargePointCommand,
  ): item is ChargePointCommand {
    return item instanceof ChargePointCommand;
  }

  // TODO 부모 Point 만들어서 production 으로 집어넣으면 어떨까
  private async retryPointCharge(
    data: CommonPointCaseDto | ChargePointCommand,
  ) {
    const maxAttempts = 4;
    const delayMs = 500;
    // 딜레이를 이용하여 Lock 충돌이 발생해도 재시도 로직으로 기회를 주도록 설정
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.userRepo.transaction(async (manager) => {
          const saveData = {
            point: 0,
            id: '',
          };
          if (this._isPointCommand(data)) {
            saveData.point = data.domain.amount;
            saveData.id = data.userProfile.id;
          } else {
            saveData.point = data.amount;
            saveData.id = data.id;
          }
          const user = await manager
            .getRepository(UserProfileEntity)
            .createQueryBuilder('user')
            .setLock('pessimistic_write')
            .where('user.id = :id', { id: saveData.id })
            .getOne();

          if (!user) throw UserError.NotFoundUser();
          user.point += saveData.point;

          await manager.save(user);
        });

        return; // 성공하면 종료
      } catch (err) {
        // 락 충돌 or Deadlock일 경우만 재시도
        const isRetryable = /deadlock|lock wait timeout/i.test(err?.message);
        if (!isRetryable || attempt === maxAttempts) {
          throw err;
        }

        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }
}
