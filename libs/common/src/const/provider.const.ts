const ProviderConst = {
  Redis: 'REDIS_CLIENT',
  AuthStrategies: 'AUTH_STRATEGY',
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
      Stock: (couponId: string | number) => 'product:stock:' + couponId,
    },
    Coupon: {
      // 재고량
      Stock: (couponId: string | number) => `coupon:stock:${couponId}`,
      // 쿠폰 수령
      Claimed: (couponId: string | number) => `coupon:claimed:${couponId}`,
    },
    User: {
      LockKey: (id: string | number) => `lock:userid:${id}`,
    },
  },
} as const;

export default ProviderConst;
