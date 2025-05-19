import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import {
  PointHistory,
  TransactionType,
  UserPoint,
  IUserIDWithEmpty,
} from './point.model';
import { UserPointTable } from 'src/database/userpoint.table';
import { PointHistoryTable } from 'src/database/pointhistory.table';
import { PointBody as PointDto } from './point.dto';

@Controller('/point')
export class PointController {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   *
   * 1. 유저를 검색하여 데이터가 있는지 체크하고 반환합니다.
   * 2. 찾은 유저의 데이터를 가지고 응답값으로 반환합니다.
   */
  /**
   * @summary 포인트를 조회합니다.
   * @throws {BadRequestException} id 검증 에러 발생
   */
  @Get(':id')
  async point(@Param('id') id: IUserIDWithEmpty): Promise<UserPoint> {
    // 유저를 검색하여 데이터가 있는지 체크하고 반환합니다.
    if (typeof id === 'undefined' || id === null || isNaN(+id)) {
      throw new BadRequestException(`id is not a valid id`);
    }

    const myUserPoint: UserPoint = await this.userDb
      .selectById(+id)
      .catch((err) => {
        if (err instanceof Error) {
          throw new BadRequestException(err.message);
        } else {
          throw new BadRequestException(`id is not a valid id`);
        }
      });

    // 2. 찾은 유저의 데이터를 가지고 응답값으로 반환합니다.
    return { id: +id, point: myUserPoint.point, updateMillis: Date.now() };
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  @Get(':id/histories')
  async history(@Param('id') id): Promise<PointHistory[]> {
    const userId = Number.parseInt(id);
    return [];
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  @Patch(':id/charge')
  async charge(
    @Param('id') id,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = pointDto.amount;
    return { id: userId, point: amount, updateMillis: Date.now() };
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(':id/use')
  async use(
    @Param('id') id,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = pointDto.amount;
    return { id: userId, point: amount, updateMillis: Date.now() };
  }
}
