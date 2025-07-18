export type IProduct = number;

/**
 * @summary 제품 랭크 프로세서 JSON 데이터
 */
export interface IProductRankOutboxJsonData {
  items: Array<{
    productId: IProduct;
    amount: number;
    price: number;
  }>;
}
