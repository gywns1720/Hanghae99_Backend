import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { PointHistory, UserPoint, IUserIDWithEmpty } from './point.model';
import { PointBody as PointDto } from './point.dto';
import { PointService } from './point.service';

@Controller('/point')
export class PointController {
  constructor(private service: PointService) {}

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
    return await this.service.verifyId(id).findUserAsync(id, true);
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   *
   * 1. 유저를 검색하여 데이터가 있는지 체크하고 반환합니다.
   * 2. 유저 아이디 기반으로 포인트 리스트 정보를 가져옵니다.
   */
  /**
   * @summary 특정 유저의 포인트 이용 내역 조회
   * @throws {BadRequestException} id 검증 에러 발생
   */
  @Get(':id/histories')
  async history(@Param('id') id: IUserIDWithEmpty): Promise<PointHistory[]> {
    return await this.service.verifyId(id).findPointListAsync(id);
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   1. 유저를 검색하여 데이터가 있는지 체크하고 반환합니다.
   2. 유저의 포인트를 충전하고 충전된 유저 포인트를 반환합니다.
   */
  /**
   * @summary 특정 유저의 포인트 충전
   * @throws {BadRequestException} id 검증 에러 발생
   */
  @Patch(':id/charge')
  async charge(
    @Param('id') id: IUserIDWithEmpty,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    return await this.service.verifyId(id).chargingPointAsync(id, pointDto);
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   * 1. 유저를 검색하여 데이터가 있는지 체크하고 반환합니다.
   * 2. 유저의 포인트를 충전하고 충전된 유저 포인트를 사용합니다..
   */
  /**
   * @summary 특정 유저의 포인트 사용
   * @throws {BadRequestException} id 검증 에러 발생 + 포인트 부족
   */
  @Patch(':id/use')
  async use(
    @Param('id') id: IUserIDWithEmpty,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    return await this.service.verifyId(id).usingPointAsync(id, pointDto);
  }
}
