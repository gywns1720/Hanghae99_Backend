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
  },
} as const;

export default ProviderConst;
