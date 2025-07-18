type Max = number;
type Min = number;
type Value = number;
type Index = number;
type TimeOut = number;
export class MathUtils {
  /**
   * 해당 값을 min ~ max 사이 값으로 반환합니다.
   * @param value {Value} 변환할 값
   * @param min {Min} 최소값 (기본값 : 0)
   * @param max {Max} 최대값 (기본값 : 100)
   */
  static clamp(value: Value, min: Min = 0, max: Max = 100): number {
    return Math.min(Math.max(min, value), max);
  }

  /**
   * 최소값과 최대값을 구합니다.
   * @param numbers {number[]} 숫자 값 리스트
   * @returns {[number,number]} [최소값, 최대값]
   */
  static minMax(...numbers: Value[]): [Min, Max] {
    if (numbers.length <= 0) return [0, 0];
    else if (numbers.length === 1) return [numbers[0], numbers[0]];
    numbers.sort((a, b) => a - b);
    return [numbers[0], numbers[numbers.length - 1]];
  }

  /**
   * 배열의 중간 인덱스를 구합니다.
   * @param arr {unknown[]} 어떤 배열이든 가능하다.
   */
  static middleIndex(...arr: unknown[]): Index {
    if (arr.length <= 0) return -1;
    return Math.floor(arr.length / 2);
  }

  /**
   * 딜레이를 발생시킵니다.
   * @param timeout {number} 밀리세컨트
   * @param args {any[]} Argument
   */
  static delay({ timeout, args }: { timeout: TimeOut; args?: any[] }) {
    return new Promise((resolve) => setTimeout(resolve, timeout, ...args));
  }
}
