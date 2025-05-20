import { PointService } from '../point.service';
import { UserPointTable } from '../../database/userpoint.table';
import { DatabaseModule } from '../../database/database.module';
import { Test } from '@nestjs/testing';
import {
  IUserID,
  IUserIDWithEmpty,
  TransactionType,
  UserPoint,
} from '../point.model';
import { PointHistoryTable } from '../../database/pointhistory.table';
import { BadRequestException } from '@nestjs/common';

describe('PointService 클래스 단위 테스트 입니다.', () => {
  /**
   * 테스트 클래스
   */
  let modulePointService: PointService | null = null;
  /**
   * @summary 유저 DB
   */
  let moduleUserDB: UserPointTable | null = null;

  let modulePointHistoryDB: PointHistoryTable | null = null;

  // 테스트할 모듈 생성
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PointService],
    }).compile();
    modulePointService = moduleRef.get(PointService);
    moduleUserDB = moduleRef.get(UserPointTable);
    modulePointHistoryDB = moduleRef.get(PointHistoryTable);

    // 가상의 데이터 삽입
    const promiseFuncUserList = [];
    const promiseFuncPointHistoryList = [];
    for (let i = 0; i < 5; i++) {
      promiseFuncUserList.push(moduleUserDB.insertOrUpdate(i + 1, i * 1000));
      promiseFuncPointHistoryList.push(
        modulePointHistoryDB.insert(
          i + 1,
          i * 1000,
          TransactionType.CHARGE,
          Date.now(),
        ),
      );
    }
    await Promise.all(promiseFuncUserList);
    await Promise.all(promiseFuncPointHistoryList);
  });

  //#region [정의 관련 테스트]
  describe('클래스 정의', () => {
    it('modulePointService 정의 되었는가?', () => {
      expect(modulePointService).toBeDefined();
      expect(modulePointService instanceof PointService).toBeTruthy();
    });

    it('moduleUserDB 정의 되었는가?', () => {
      expect(moduleUserDB).toBeDefined();
      expect(moduleUserDB instanceof UserPointTable).toBeTruthy();
    });

    it('modulePointHistoryDB 정의 되었는가?', () => {
      expect(modulePointHistoryDB).toBeDefined();
      expect(modulePointHistoryDB instanceof PointHistoryTable).toBeTruthy();
    });
  });
  //#endregion

  //#region [유저 정보 검색]
  describe('PointService 유저 정보를 검색 API', () => {
    describe('가상 함수를 만들어 유저 정보 검색', () => {
      it('가상 함수를 만들어서 유저 2번을 검색하여 포인트가 1000 정도 쌓여있는지 테스트', async () => {
        const virtualPointService = new PointService(
          moduleUserDB,
          modulePointHistoryDB,
        );
        const spyGet = jest
          .spyOn(virtualPointService, 'findUserAsync')
          .mockImplementation(async (id: IUserID) => {
            return await moduleUserDB.selectById(+id);
          });

        const result = await virtualPointService.findUserAsync(2);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(result).toHaveProperty('id', 2);
        expect(result).toHaveProperty('point', 1000);
      });
      it('가상 함수를 만들어서 유저 -1번을 검색하여 예외가 발생하는지 체크', async () => {
        const virtualPointService = new PointService(
          moduleUserDB,
          modulePointHistoryDB,
        );
        const spyGet = jest
          .spyOn(virtualPointService, 'findUserAsync')
          .mockImplementation(async (id: IUserID) => {
            return await moduleUserDB.selectById(+id);
          });
        await expect(virtualPointService.findUserAsync(-2)).rejects.toThrow(
          PointService.ErrorName.UserPointError,
        );
        await expect(virtualPointService.findUserAsync(-2)).rejects.toThrow(
          Error,
        );
        expect(spyGet).toHaveBeenCalledTimes(2);
      });
    });

    describe('서비스 함수를 만들어서 유저 정보 검색', () => {
      it('서비스 로직을 만들어서 유저3번을 검색하여 포인트가 2000 정도 쌓여있는지 테스트', async () => {
        /*
         * jest.spyOn 해당 메서드를 감시하는 로직
         * mockImplementation : 원래 로직을 무시하고 fn 으로 대체
         */
        const spyGet = jest.spyOn(modulePointService, 'findUserAsync');

        const result = await modulePointService.findUserAsync(3);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(result).toHaveProperty('id', 3);
        expect(result).toHaveProperty('point', 2000);
      });

      it('서비스 로직을 이용하여 유저 문자열 방식으로 3번을 검색하여 포인트가 2000 정도 쌓여있는지 테스트', async () => {
        /*
         * jest.spyOn 해당 메서드를 감시하는 로직
         * mockImplementation : 원래 로직을 무시하고 fn 으로 대체
         */
        const spyGet = jest.spyOn(modulePointService, 'findUserAsync');

        const result = await modulePointService.findUserAsync('3');
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(result).toHaveProperty('id', 3);
        expect(result).toHaveProperty('point', 2000);
      });

      it('서비스 로직을 이용하여 -1 번의 유저를 검색 했을 때 예외처리가 발생하는지 테스트', async () => {
        await expect(modulePointService.findUserAsync(-1)).rejects.toThrow(
          BadRequestException,
        );
        await expect(modulePointService.findUserAsync(-1)).rejects.toThrow(
          PointService.ErrorName.UserPointError,
        );
      });

      it('서비스 로직을 이용하여 빈 문자열 을 입력했을 때 예외처리 발생하는 테스트', async () => {
        await expect(modulePointService.findUserAsync('')).rejects.toThrow(
          BadRequestException,
        );
        await expect(modulePointService.findUserAsync('')).rejects.toThrow(
          PointService.ErrorName.UserPointError,
        );
      });
      it('서비스 로직을 이용하여 특수문자 등 을 입력했을 때 예외처리 발생하는 테스트', async () => {
        await expect(modulePointService.findUserAsync('$%@!#')).rejects.toThrow(
          BadRequestException,
        );
        await expect(modulePointService.findUserAsync('$%@!#')).rejects.toThrow(
          PointService.ErrorName.UserPointError,
        );
      });
      it('서비스 로직을 이용하여 무한 혹은 NaN 을 입력했을 때 예외처리 발생하는 테스트', async () => {
        await Promise.all([
          expect(modulePointService.findUserAsync(Infinity)).rejects.toThrow(
            PointService.ErrorName.UserPointError,
          ),
          expect(
            modulePointService.findUserAsync(Number('Asdnvc')),
          ).rejects.toThrow(PointService.ErrorName.UserPointError),
          expect(modulePointService.findUserAsync(Infinity)).rejects.toThrow(
            BadRequestException,
          ),
          expect(
            modulePointService.findUserAsync(Number('Asdnvc')),
          ).rejects.toThrow(BadRequestException),
        ]);
      });
    });
  });
  //#endregion

  //#region [유저 포인트 내역 검색]
  describe('유저 포인트 내역 조회 관련 API', () => {
    // 유저 포인트인지 체크
    const isUserId = (
      instance: IUserID | UserPoint | Pick<UserPoint, 'id'> | IUserIDWithEmpty,
    ): instance is IUserID => {
      return typeof instance === 'number' || typeof instance === 'string';
    };

    describe('가상 함수를 만들어 포인트 조회', () => {
      it('유저 아이디를 가져와서 에 관한 포인트 내역을 조회합니다.', async () => {
        const spyGet = jest
          .spyOn(modulePointService, 'findPointListAsync')
          .mockImplementation(
            async (userIdOrPointObj: IUserID | Pick<UserPoint, 'id'>) => {
              return await modulePointHistoryDB.selectAllByUserId(
                !isUserId(userIdOrPointObj)
                  ? userIdOrPointObj.id
                  : +userIdOrPointObj,
              );
            },
          );

        const result = await modulePointService.findPointListAsync(2);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('amount', 1000);
        // expect(result.findIndex((item) => item.id === 1)).toBe(1);
      });

      it('유저 객체를 가져와서 에 관한 포인트 내역을 조회합니다.', async () => {
        const spyGet = jest
          .spyOn(modulePointService, 'findPointListAsync')
          .mockImplementation(
            async (userIdOrPointObj: IUserID | Pick<UserPoint, 'id'>) => {
              return await modulePointHistoryDB.selectAllByUserId(
                !isUserId(userIdOrPointObj)
                  ? userIdOrPointObj.id
                  : +userIdOrPointObj,
              );
            },
          );

        const result = await modulePointService.findPointListAsync({ id: 2 });
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toHaveProperty('amount', 1000);
        // expect(result.findIndex((item) => item.id === 1)).toBe(1);
      });

      it('예기치 못한  유저 아이디를 가지고 포인트 내역을 조회했을 때 ', async () => {
        jest
          .spyOn(modulePointService, 'findPointListAsync')
          .mockImplementation(
            async (userIdOrPointObj: IUserID | Pick<UserPoint, 'id'>) => {
              return await modulePointHistoryDB.selectAllByUserId(
                !isUserId(userIdOrPointObj)
                  ? userIdOrPointObj.id
                  : +userIdOrPointObj,
              );
            },
          );

        const result = await modulePointService.findPointListAsync(Infinity);

        expect(result).toStrictEqual([]);
        expect(result.length).toBe(0);
      });
      it('예기치 못한 유저 객체를 가지고 포인트 내역을 조회했을 때 ', async () => {
        jest
          .spyOn(modulePointService, 'findPointListAsync')
          .mockImplementation(
            async (
              userIdOrPointObj: IUserID | Pick<UserPoint, 'id'> | UserPoint,
            ) => {
              return await modulePointHistoryDB.selectAllByUserId(
                !isUserId(userIdOrPointObj)
                  ? userIdOrPointObj.id
                  : +userIdOrPointObj,
              );
            },
          );

        const result = await modulePointService.findPointListAsync({
          id: -20,
        });

        expect(result).toStrictEqual([]);
        expect(result.length).toBe(0);
      });
    });
  });

  //#endregion
});
