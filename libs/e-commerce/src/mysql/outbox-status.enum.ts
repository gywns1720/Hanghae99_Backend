export enum OutboxStatus {
  PENDING = 0, // 처리 대기
  PROCESSING = 1, // 처리 중
  FAILED = 2, // 재시도 초과 또는 검증 실패
  SENT = 3, // 정상 처리 완료
}
