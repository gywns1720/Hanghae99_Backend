import 'dayjs/locale/ko';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';

/**
 * @summary  DateUtils 클래스
 *
 */
export class DateUtils {
  // 플러그인 셋팅 여부
  protected static isPluginSetting: boolean = false;

  /**
   * @summary 플러그인을 셋팅합니ㅏㄷ.
   */
  static pluginSetting() {
    if (DateUtils.isPluginSetting) {
      return;
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(isSameOrBefore);
    dayjs.extend(LocalizedFormat);
    dayjs.extend(isSameOrAfter);
    dayjs.extend(customParseFormat);
    dayjs.extend(isoWeek);
    dayjs.extend(isBetween);
    dayjs.extend(weekOfYear);
    dayjs.tz.setDefault('Asia/Seoul');
    DateUtils.isPluginSetting = true;
  }

  /** 현재 시간 (기본 로컬) */
  static now(): dayjs.Dayjs {
    return dayjs();
  }

  /** 오늘 날짜 */
  static today(): dayjs.Dayjs {
    return dayjs().startOf('day');
  }

  /** 내일 날짜 */
  static tomorrow(): dayjs.Dayjs {
    return dayjs().add(1, 'day').startOf('day');
  }

  /** 어제 날짜 */
  static yesterday(): dayjs.Dayjs {
    return dayjs().subtract(1, 'day').startOf('day');
  }

  /** 날짜 포맷팅 */
  static format(
    date: string | Date | dayjs.Dayjs,
    format = 'YYYY-MM-DD',
  ): string {
    return dayjs(date).format(format);
  }

  /** 두 날짜가 같은 날짜인지 (포맷 기준) */
  static isSame(
    date1: any,
    date2: any,
    unit: dayjs.OpUnitType = 'day',
  ): boolean {
    return dayjs(date1).isSame(date2, unit);
  }

  /** 현재가 미래인지 */
  static isFuture(date: string | Date | dayjs.Dayjs): boolean {
    return dayjs(date).isAfter(dayjs());
  }

  /** 현재가 과거인지 */
  static isPast(date: string | Date | dayjs.Dayjs): boolean {
    return dayjs(date).isBefore(dayjs());
  }

  /** 날짜 차이 (기본: 일) */
  static diff(
    date1: string | Date | dayjs.Dayjs,
    date2: string | Date | dayjs.Dayjs,
    unit: dayjs.OpUnitType = 'day',
  ): number {
    return dayjs(date1).diff(dayjs(date2), unit);
  }

  /** 특정 시간대 반환 (예: Asia/Seoul) */
  static nowInTimezone(tz: string): dayjs.Dayjs {
    return dayjs().tz(tz);
  }

  /** 문자열을 날짜로 파싱 */
  static parse(dateStr: string, format = 'YYYY-MM-DD'): dayjs.Dayjs {
    return dayjs(dateStr, format);
  }

  /**  주 시작일 (기본 일요일 기준) */
  static startOfWeek(date?: string | Date | dayjs.Dayjs): dayjs.Dayjs {
    return dayjs(date ?? undefined).startOf('week');
  }

  /**  주 종료일 (기본 토요일 기준) */
  static endOfWeek(date?: string | Date | dayjs.Dayjs): dayjs.Dayjs {
    return dayjs(date ?? undefined).endOf('week');
  }

  /**  특정 날짜가 시작일과 종료일 사이인지 포함 여부 */
  static isBetween(
    date: string | Date | dayjs.Dayjs,
    start: string | Date | dayjs.Dayjs,
    end: string | Date | dayjs.Dayjs,
    inclusive: boolean = true,
  ): boolean {
    return dayjs(date).isBetween(
      dayjs(start),
      dayjs(end),
      null,
      inclusive ? '[]' : '()',
    );
  }

  /**  UTC로 변환 */
  static toUTC(date: string | Date | dayjs.Dayjs): dayjs.Dayjs {
    return dayjs(date).utc();
  }

  /**  UTC → 로컬 시간대로 변환 */
  static fromUTC(
    date: string | Date | dayjs.Dayjs,
    tz = dayjs.tz.guess(),
  ): dayjs.Dayjs {
    return dayjs.utc(date).tz(tz);
  }

  /**  N주차 계산 */
  static getWeekOfYear(date?: any): number {
    return dayjs(date ?? undefined).week();
  }

  /**  월 시작일 */
  static startOfMonth(date?: any): dayjs.Dayjs {
    return dayjs(date ?? undefined).startOf('month');
  }

  /**  월 종료일 */
  static endOfMonth(date?: any): dayjs.Dayjs {
    return dayjs(date ?? undefined).endOf('month');
  }

  /**  연도 시작일 */
  static startOfYear(date?: any): dayjs.Dayjs {
    return dayjs(date ?? undefined).startOf('year');
  }

  /**  연도 종료일 */
  static endOfYear(date?: any): dayjs.Dayjs {
    return dayjs(date ?? undefined).endOf('year');
  }
  /**  안전한 ISO 문자열 변환기 */
  static toISOStringSafe(
    value: string | Date | dayjs.Dayjs | null | undefined,
  ): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value;
    return dayjs(value).toISOString();
  }
}
