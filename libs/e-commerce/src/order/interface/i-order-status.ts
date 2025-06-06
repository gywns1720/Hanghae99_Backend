export type IOrderStatus =
  | IOrderProcessing
  | IOrderSuccess
  | IOrderRefund
  | number;

export type IOrderProcessing = 0;
export type IOrderSuccess = 1;
export type IOrderRefund = 2;
