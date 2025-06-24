/**
 * @summary 제품 재고 감소
 */
export class PurchaseProductCommand {
  constructor(
    // 제품 아이디
    public readonly productId: string,
    // 재고량
    public readonly quantity: number,
  ) {}
}
