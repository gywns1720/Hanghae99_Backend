import { CustomError } from '@lib/common';

/**
 * @summary 응답 데이터
 */
export interface IResponseData<T = any> {
  status: number;
  code: number;
  message: string;
  payload: T;
}
export type ITransaction<T> = {
  payload: T;
  error: string | null | Error | CustomError;
  isSuccess: boolean;
};
