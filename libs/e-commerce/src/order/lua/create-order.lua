-- 재고 차감
-- ARGV: [user_id, product_1_id, product_1_amount, product_2_id, product_2_amount, ...]
-- KEYS: [product_1_stock_key, product_2_stock_key, ...]

-- 제품별로 남은 수량 확인
for i = 1, #KEYS do
  local stock = tonumber(redis.call('GET', KEYS[i]))
  local required = tonumber(ARGV[2*i])
  if stock == nil or stock < required then
    return -1 -- 재고 부족
  end
end

-- 차감 수행
for i = 1, #KEYS do
  redis.call('DECRBY', KEYS[i], ARGV[2*i])
end

return 1 -- 성공
