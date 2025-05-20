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
 * @updated 2025-05-20 01:26
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
    try {
      return await this.userDb
        .selectById(+id)
        .then((res) => this._updateToUserPoint(id, res, isRealTimeUpdate));
    } catch (err) {
      // selectById 안의 동기적 예외 발생 여부
      this._errorNotFoundUserId(err);
    }
  }
  /**
   * @summary 특정 유저 아이디의 포인터 리스트를 가져옵니다.
   * @param userIdOrPointObj {IUserID | UserPoint} 객체 혹은 유저 아이디
   * @throws BadRequestException 유저 아이디 잘못 입력한 경우
   */
  async findPointListAsync(
    userIdOrPointObj: IUserID | Pick<UserPoint, 'id'>,
  ): Promise<PointHistory[]> {
    try {
      return await this.historyDb.selectAllByUserId(
        !this._isUserID(userIdOrPointObj)
          ? userIdOrPointObj.id
          : +userIdOrPointObj,
      );
    } catch (err) {
      this._errorNotFoundUserId(err);
    }
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
   * @throws {_errorNotFoundUserId} 검증 실패
   */
  async chargingPointAsync(
    idOrPointObject: IUserID | UserPoint,
    amount: number | PointBody,
  ): Promise<UserPoint> {
    // 기본값 지정
    const userPoint: UserPoint = await this._findUserPoint(idOrPointObject);

    const _amount = this._parseAmount(amount);

    this._verifyPipe(
      _amount,
      userPoint,
      this._verifyAmountLessThanZero.bind(this),
      this._verifyAmountNotFoundUserId.bind(this),
    );

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
  /**
   * @summary 포인트를 사용합니다.
   * @param idOrPointObject {IUserID | UserPoint} 유저 아이디 혹은 유저 포인트 객체
   * @param amount {number} 사용량
   * @returns {Promise<UserPoint>}
   * @throws {_errorNotFoundUserId} 검증 실패
   */
  async usingPointAsync(
    idOrPointObject: IUserID | UserPoint,
    amount: number | PointBody,
  ): Promise<UserPoint> {
    // 기본값 지정
    const userPoint: UserPoint = await this._findUserPoint(idOrPointObject);

    const _amount = this._parseAmount(amount);

    this._verifyPipe(
      _amount,
      userPoint,
      this._verifyAmountLessThanZero.bind(this),
      this._verifyAmountNotFoundUserId.bind(this),
      this._verifyPointInsufficient.bind(this),
    );

    // 데이터베이스에 저장
    await Promise.all([
      this.historyDb.insert(
        userPoint.id,
        _amount,
        TransactionType.USE,
        Date.now(),
      ),
      this.userDb.insertOrUpdate(userPoint.id, userPoint.point - _amount),
    ]);

    // 포인트 추가
    userPoint.point -= _amount;
    return userPoint;
  }

  //#endregion

  //#region [Private Methods]

  private _findUserPoint(
    idOrPointObject: IUserID | UserPoint,
  ): Promise<UserPoint> {
    return new Promise((r) => {
      if (this._isUserPoint(idOrPointObject)) {
        r(this._updateToUserPoint(idOrPointObject.id, idOrPointObject));
      } else {
        this.findUserAsync(idOrPointObject, true).then((res) => r(res));
      }
    });
  }

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
    return PointService.ErrorName;
  }

  /**
   * @summary 에러 메세지 이름
   * @constructor
   * @private
   */
  static get ErrorName() {
    return {
      // 유저 찾을 수 없는 경우
      NotFoundUserId: 'Failed to validate the id.',
      // 포인트 Data 에 문제가 발생한 경우
      ValidPointData: 'Failed to validate the point.',
      // 포인트 부족
      InsufficientPoint: '"Insufficient points.',
      // UserPointTable Error
      UserPointError: '올바르지 않은 ID 값 입니다.',
    } as const;
  }

  /**
   * @summary UserPoint 인가?
   * @param instance {IUserID | UserPoint | IUserIDWithEmpty} 데이터
   * @private
   * @returns {boolean} true 이면 UserPoint 객체
   */
  private _isUserPoint(
    instance: IUserID | UserPoint | IUserIDWithEmpty | Pick<UserPoint, 'id'>,
  ): instance is UserPoint {
    return (
      typeof instance === 'object' &&
      instance !== null &&
      typeof instance.id === 'number' &&
      typeof (instance as UserPoint)?.point === 'number' &&
      typeof (instance as UserPoint)?.updateMillis === 'number'
    );
  }
  /**
   * @summary UserID 인가?
   * @param instance {IUserID | UserPoint | IUserIDWithEmpty} 데이터
   * @private
   * @returns {boolean} true 이면 IUserID 타입
   */
  private _isUserID(
    instance: IUserID | UserPoint | IUserIDWithEmpty | Pick<UserPoint, 'id'>,
  ): instance is IUserID {
    return typeof instance === 'number' || typeof instance === 'string';
  }
  /**
   * @summary amount 값 설정
   * @param amount {number | string | PointBody} 입력이오는 값
   * @private
   * @returns number -1 이면 재대로 입력이 안된 값이다.
   */
  private _parseAmount(amount: number | string | PointBody): number | -1 {
    return typeof amount === 'string'
      ? isNaN(parseInt(amount))
        ? -1
        : parseInt(amount)
      : typeof amount === 'number'
        ? amount
        : amount instanceof PointBody ||
            typeof (amount as PointBody).amount === 'number'
          ? (amount as PointBody).amount
          : -1;
  }

  /**
   * @summary amount 가 Zero 미만 인 경우
   * @param amount
   * @param _
   * @private
   */
  private _verifyAmountLessThanZero(
    amount: number,
    _: UserPoint,
  ): void | never {
    if (amount < 0) this._errorNotFoundUserId(this.ErrorName.ValidPointData);
  }

  /**
   * @summary userPoint id 값이 존재하지 않는 경우
   * @param amount
   * @param userPoint
   * @private
   */
  private _verifyAmountNotFoundUserId(
    amount: number,
    userPoint: UserPoint,
  ): void | never {
    if (userPoint.id < 0)
      this._errorNotFoundUserId(this.ErrorName.ValidPointData);
  }
  /**
   * @summary Point 부족
   * @param amount
   * @param userPoint
   * @private
   */
  private _verifyPointInsufficient(
    amount: number,
    userPoint: UserPoint,
  ): void | never {
    if (userPoint.point - amount < 0)
      this._errorNotFoundUserId(this.ErrorName.InsufficientPoint);
  }

  /**
   * @summary 검증 파이프
   * @param amount {number} 값
   * @param userPoint {UserPoint} 유저 포인트
   * @param callbacks {(amount: number, userPoint: UserPoint) => void | never} 콜백함수 배열
   * @private
   */
  private _verifyPipe(
    amount: number,
    userPoint: UserPoint,
    ...callbacks: Array<(amount: number, userPoint: UserPoint) => void | never>
  ) {
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i](amount, userPoint);
    }
  }
  //#endregion
}
