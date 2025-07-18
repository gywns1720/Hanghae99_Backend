import * as bcrypt from 'bcryptjs';

import * as process from 'node:process';
import { CookieOptions, Request, Response } from 'express';
import * as _ from 'lodash';
/**
 * @summary 보안 유틸
 */
export class SecurityUtils {
  /**
   * 데이터를 Base64로 인코딩합니다.
   * @param message 데이터
   */
  static base64encode<
    T extends
      | string
      | number
      | Record<string | number, any>
      | Array<any> = string,
  >(message: T): string {
    const encode = (serialize: string) => {
      return Buffer.from(serialize, 'utf-8').toString('base64');
    };
    if (typeof message === 'string') {
      return encode(message);
    }
    return encode(JSON.stringify(message));
  }

  /**
   * base64 를 디코더 합니다.
   * @param encode
   */
  static base64decode<PAYLOAD = any>(encode: string): PAYLOAD | null {
    if (encode.trim() === '') return null;
    const decode = Buffer.from(encode, 'base64').toString('utf-8');
    if (!decode || decode === '') return null;
    try {
      return JSON.parse(decode) as PAYLOAD;
    } catch (_) {
      return decode as PAYLOAD;
    }
  }

  /**
   * 보안 Salt 생성
   * 비밀번호에 Salt 를 추가하여 비밀번호가 길어보이도록 보입니다.
   * @param count {number} Salt 길이 (기본값 10)
   * @return Promise<string | null> `null` 인 경우 생성에 문제가 발생했음을 알려줍니다.
   */
  static generatorSalt(count: number = 10): Promise<string | null> {
    return new Promise((resolve) => {
      bcrypt.genSalt(count, (err, salt) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(salt);
      });
    });
  }

  /**
   * 암호화 된 Hash 생성
   *
   * 주로 비밀번호 암호화된 걸로 사용합니다.
   * @param password {string} 비밀번호
   * @param salt {string} 비밀번호에 Salt 를 첨부합니다.
   * @return {Promise<string | null>} null 인 경우 암호화에 실패한 상태입니다.
   */
  static generatorHash(password: string, salt: string): Promise<string | null> {
    return new Promise((resolve) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(hash);
      });
    });
  }

  /**
   * 비밀번호와 암호화된 비밀번호가 일치하는지 체크합니다.
   * @param password {string} 입력한 비밀번호
   * @param databasePassword {string} 데이터베이스에 저장되어 있는 암호화 비밀번호
   * @return {Promise<-1 | 0 | 1>} `-1` 인 경우 에러로 검증 실패, `0` -> 검증 실패, `1` -> 검증 성공
   */
  static compare(
    password: string,
    databasePassword: string,
  ): Promise<-1 | 0 | 1> {
    return new Promise((resolve) => {
      bcrypt.compare(password, databasePassword, (err, hash) => {
        if (err) {
          resolve(-1);
          return;
        }
        resolve(hash ? 1 : 0);
      });
    });
  }

  /**
   * 기본 쿠키 옵션
   * @constructor
   */
  static get DefaultCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    };
  }

  /**
   * 쿠키를 저장합니다.
   * @param res {Response} 응답 객체
   * @param key {string} 쿠키 키
   * @param value {string} 쿠키 값
   * @param options {CookieOptions} 쿠키 옵션
   */
  static saveCookie(
    res: Response,
    key: string,
    value: string,
    options?: CookieOptions,
  ) {
    if (!res?.cookie) return false;
    res.cookie(key, value, _.merge(this.DefaultCookieOptions, options));
    return true;
  }

  /**
   * 쿠키 데이터를 가져옵니다.
   * @param req {Request} 요청 객체
   * @param key {string} 쿠키 키
   * @returns {string | null} 쿠키 데이터 없으면 null
   */
  static getCookie(req: Request, key: string): string | null {
    if (req.signedCookies && req.signedCookies[key]) {
      return req.signedCookies[key] as string;
    } else if (!req.cookies) return null;
    return (req.cookies[key] as string) ?? null;
  }

  /**
   * 쿠키를 삭제합니다.
   * @param res {Response} 응답 객체
   * @param key {string | string[]} 쿠키 키
   * @param options {CookieOptions} 쿠키 옵션
   */
  static deleteCookie(
    res: Response,
    key: string | string[],
    options?: CookieOptions,
  ) {
    if (!res.clearCookie) return false;
    if (Array.isArray(key)) {
      key.forEach((k) => {
        res.clearCookie(k, _.merge(this.DefaultCookieOptions, options));
      });
    } else {
      res.clearCookie(key, _.merge(this.DefaultCookieOptions, options));
    }
  }

  /**
   * @summary 응답 객체에 헤더를 추가합니다.
   * @param res {Response} 응답객체
   * @param key {string} 헤더 키
   * @param value {string | string[]} 헤더 값
   */
  static setHeader(
    res: Response,
    key: string,
    value: string | string[],
  ): boolean {
    if (!res?.setHeader) {
      return false;
    }
    res.setHeader(key, value);
    return true;
  }

  /**
   * @summary 요청객체에서 해더를 가져옵니다.
   * @param req {Request} 요청 객체
   * @param key {string} 키
   */
  static getHeader(req: Request, key: string): string | null {
    if (!req?.headers) return null;
    const item = req.headers[key];

    if (typeof item === 'undefined' || item === null) return null;
    else if (typeof item === 'string') return item;
    else if (Array.isArray(item) && item.length > 0) return item[0];
    else return null;
  }

  /**
   * @summary Bearer 토큰 가져오기
   * @param req {Request} 응답 객체
   */
  static getAuthorization(req: Request) {
    const authorization = this.getHeader(req, 'authorization');
    if (authorization == null) return null;
    const split = authorization.split('Bearer ');
    if (split.length <= 1) return null;
    return typeof split[1] === 'string' ? split[1].trim() : null;
  }
}
