const ProviderConst = {
  Redis: 'REDIS_CLIENT',
  Processor: {
    Product: {
      // 랭킹 업데이트 (product-rank.processor.ts)
      Rank: 'Event.Product.Rank',
    },
  },
  RedisKey: {
    Product: {
      // 판매 갯수 랭킹
      RankingAmount: 'product:ranking:amount',
      // 판매량 랭킹
      RankingPrice: 'product:ranking:price',
    },
    Coupon: {
      // 재고량
      Stock: (couponId: string | number) => `coupon:stock:${couponId}`,
      // 쿠폰 수령
      Claimed: (couponId: string | number) => `coupon:claimed:${couponId}`,
    },
  },
} as const;

export default ProviderConst;
