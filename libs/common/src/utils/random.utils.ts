import dayjs from 'dayjs';
/**
 * @summary 랜덤 유틸
 */
export class RandomUtils {
  private static Characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  /**
   * 범위내에서 랜덤으로 숫자를 생성합니다.
   * @param min {number} 최소값
   * @param max {number} 최대값
   *
   * 만약 최대값이 최소값 보다 적은 경우 서로 스왑합니다.
   * @returns number 랜덤 값
   */
  static range(min: number, max: number): number {
    // 최소값
    const _min = Math.min(min, max);
    const _max = Math.max(min, max);
    return Math.floor(Math.random() * (_max - _min)) + _min;
  }

  /**
   * 숫자 위치(앞부분 혹은 뒷부분)에 따라 자리수 만큼 0을 붙입니다.
   * @param pos {'start' | 'end'} start -> 숫자 앞부분에 0을 채웁니다. env -> 숫자 뒷부분에 0을 채웁니다.
   * @param value {number} 0을 채울 숫자
   * @param round {number | undefined} 자릿수 (만약 undefined 인 경우 value 의 자리수 만큼으로 설정됩니다.
   * @return {string}  0으로 채워진 문자열 반환값
   * @example```ts
   * zeroFill('end', 3255, 6); // 325500
   * zeroFill('start', 3255, 6); // 003255
   * ```
   */
  static zeroFill(pos: 'start' | 'end', value: number, round?: number): string {
    const valueStr = value.toString();
    const count: number =
      typeof round === 'undefined' || isNaN(+round) ? valueStr.length : round;
    if (pos === 'end') return valueStr.padEnd(count, '0');
    return valueStr.padStart(count, '0');
  }

  /**
   * `length` 만큼 랜덤한 문자열을 생성합니다.
   * 랜덤 문자열 범위는 `Characters` 정적 프로퍼티에 저장되어 있습니다.
   * @param length {number} 크기
   * @return string 크기
   */
  static randomStr(length: number): string {
    const strArr: string[] = [];
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * RandomUtils.Characters.length);
      strArr.push(RandomUtils.Characters.charAt(idx));
    }
    return strArr.join('');
  }

  /**
   * 32자에 달하는 문자열을 생성합니다.
   * @param header {string} 머리말 문자열
   * @param currDate {dayjs.Dayjs | Date | undefined | null | string} 날짜를 잡습니다. 만약 undefined 나 null 인 경우 날짜는 제외됩니다.
   * @return string 문자열 Header(8자 이내) + Body(10 ) + Date(12) + Footer (4)
   */
  static generatorID(
    header: string,
    currDate?: dayjs.Dayjs | Date | undefined | null | string,
  ) {
    const headerTrim = header.trim();
    const headerStr =
      headerTrim.length >= 8
        ? headerTrim.substring(0, 8)
        : headerTrim.concat(this.randomStr(8)).substring(0, 8);
    const randomStr = this.randomStr(30);
    const bodyStr = randomStr.substring(0, 10);
    let dateStr = '';

    if (typeof currDate === 'undefined' || currDate === null) {
      dateStr = randomStr.substring(11, 23);
    } else if (typeof currDate === 'string') {
      dateStr =
        currDate.length >= 12
          ? currDate.substring(0, 12)
          : currDate.concat(randomStr.substring(0, 12)).substring(0, 12);
    } else if (currDate instanceof Date) {
      const YY = String(currDate.getFullYear()).slice(2); // 연도에서 마지막 두 자리
      const MM = String(currDate.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 1을 더함)
      const DD = String(currDate.getDate()).padStart(2, '0'); // 일
      const HH = String(currDate.getHours()).padStart(2, '0'); // 시
      const mm = String(currDate.getMinutes()).padStart(2, '0'); // 분
      const ss = String(currDate.getSeconds()).padStart(2, '0'); // 초
      dateStr = `${YY}${MM}${DD}${HH}${mm}${ss}`;
    } else {
      dateStr = currDate.format('YYYYMMDDHHmmss').slice(-12);
    }
    const footerStr = randomStr.substring(24, 28);

    return `${headerStr}${bodyStr}${dateStr}${footerStr}`;
  }
}
