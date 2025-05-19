import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPointTable } from '../database/userpoint.table';
import { PointHistoryTable } from '../database/pointhistory.table';
import {
  IUserID,
  IUserIDWithEmpty,
  PointHistory,
  TransactionType,
  UserPoint,
} from './point.model';
import { PointBody } from './point.dto';

/**
 * @summary 포인트 서비스
 * @author HJ
 * @updated 2025-05-20 00:06
 */
@Injectable()
export class PointService {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  //#region [Public Methods]

  /**
   * @summary 유저 정보를 검색합니다.
   * @param id {IUserID} 유저 아이디
   * @param isRealTimeUpdate {boolean}
   * @returns {Promise<UserPoint>}
   * @throws _errorNotFoundUserId 아이디로 검색에 실패한 경우
   * @async
   */
  async findUserAsync(
    id: IUserID,
    isRealTimeUpdate: boolean = false,
  ): Promise<UserPoint> {
    return await this.userDb
      .selectById(+id)
      .then((res) => this._updateToUserPoint(id, res, isRealTimeUpdate))
      .catch((err) => this._errorNotFoundUserId(err));
  }

  /**
   * @summary 특정 유저 아이디의 포인터 리스트를 가져옵니다.
   * @param userIdOrPointObj {IUserID | UserPoint} 객체 혹은 유저 아이디
   * @throws BadRequestException 유저 아이디 잘못 입력한 경우
   */
  async findPointListAsync(
    userIdOrPointObj: IUserID | UserPoint,
  ): Promise<PointHistory[]> {
    return await this.historyDb
      .selectAllByUserId(
        this._isUserPoint(userIdOrPointObj)
          ? userIdOrPointObj.id
          : +userIdOrPointObj,
      )
      .catch((err) => this._errorNotFoundUserId(err));
  }

  /**
   * @summary 아이디를 검증합니다.
   * @param id {IUserIDWithEmpty} 유저 아이디
   * @throws _errorNotFoundUserId 아이디 검증 실패
   */
  verifyId(id: IUserIDWithEmpty): PointService {
    if (typeof id === 'undefined' || id === null || isNaN(+id)) {
      this._errorNotFoundUserId(this.ErrorName.NotFoundUserId);
    }
    return this;
  }

  /**
   * @summary 포인트를 충전합니다.
   * @param idOrPointObject {IUserID | UserPoint} 유저 아이디 혹은 유저 포인트 객체
   * @param amount {number} 충전량
   * @returns {Promise<UserPoint>}
   * @throws {_errorNotFoundUserId}
   */
  async chargingPointAsync(
    idOrPointObject: IUserID | UserPoint,
    amount: number | PointBody,
  ): Promise<UserPoint> {
    // 기본값 지정
    let userPoint: UserPoint = {
      id: -1,
      point: 0,
      updateMillis: Date.now(),
    };

    const _amount =
      typeof amount === 'number'
        ? amount
        : amount instanceof PointBody ||
            typeof (amount as PointBody).amount === 'number'
          ? (amount as PointBody).amount
          : -1;

    // amount 검사에 문제가 발생한 경우
    if (_amount < 0) {
      this._errorNotFoundUserId(this.ErrorName.ValidPointData);
    }

    // 유저 포인트 객체인지 아이디 인지 체크
    if (this._isUserPoint(idOrPointObject)) {
      userPoint = this._updateToUserPoint(idOrPointObject.id, idOrPointObject);
    } else {
      userPoint = await this.findUserAsync(idOrPointObject, true);
    }

    // 유저 아이디가 존재하지 않는 경우
    if (userPoint.id < 0) {
      this._errorNotFoundUserId(this.ErrorName.NotFoundUserId);
    }

    // 데이터베이스에 저장
    await Promise.all([
      this.historyDb.insert(
        userPoint.id,
        _amount,
        TransactionType.CHARGE,
        Date.now(),
      ),
      this.userDb.insertOrUpdate(userPoint.id, userPoint.point + _amount),
    ]);

    // 포인트 추가
    userPoint.point += _amount;
    return userPoint;
  }

  //#endregion

  //#region [Private Methods]

  /**
   * @summary UserPoint 을 갱신합니다.
   * @param id {IUserID} 유저 아이디
   * @param point {UserPoint} 포인트 객체
   * @param isRealTimeUpdate {boolean} 시간을 현재로 변경할껀지 여부
   * @private
   */
  private _updateToUserPoint(
    id: IUserID,
    point: UserPoint,
    isRealTimeUpdate: boolean = true,
  ): UserPoint {
    return {
      ...point,
      id: +id,
      updateMillis: isRealTimeUpdate ? Date.now() : point.updateMillis,
    };
  }

  /**
   * @summary 유저를 찾을 수 없는 경우 예외 처리
   * @param error {Error} 에러 정보
   * @private
   * @throws BadRequestException 유저를 찾을 수 없는 경우 발생하는 예외
   */
  private _errorNotFoundUserId(error: string | Error | any): never {
    if (error instanceof BadRequestException) {
      throw error;
    } else if (error instanceof Error) {
      throw new BadRequestException(error.message);
    } else if (typeof error === 'string') {
      throw new BadRequestException(error);
    } else {
      throw new BadRequestException(this.ErrorName.NotFoundUserId);
    }
  }

  /**
   * @summary 에러 메세지 이름
   * @constructor
   * @private
   */
  private get ErrorName() {
    return {
      NotFoundUserId: 'Failed to validate the id.',
      ValidPointData: 'Failed to validate the point.',
    } as const;
  }

  /**
   * @summary UserPoint 인가?
   * @param instance {IUserID | UserPoint | IUserIDWithEmpty} 데이터
   * @private
   * @returns {boolean} true 이면 UserPoint 객체
   */
  private _isUserPoint(
    instance: IUserID | UserPoint | IUserIDWithEmpty,
  ): instance is UserPoint {
    return (
      typeof instance === 'object' &&
      instance !== null &&
      typeof instance.id === 'number' &&
      typeof instance.point === 'number' &&
      typeof instance.updateMillis === 'number'
    );
  }

  //#endregion
}
