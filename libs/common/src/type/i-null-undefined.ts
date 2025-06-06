/**
 * @summary Null + 제네릭타입
 */
export type INull<T> = null | T;

/**
 * @summary Null + undefined 포함한 타입
 */
export type INullUndefined<T> = INull<T> | undefined;
