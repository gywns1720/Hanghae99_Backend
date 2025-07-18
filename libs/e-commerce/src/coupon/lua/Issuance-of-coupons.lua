
-- Redis 명령어 정리
-- KEYS[1] => stockKey (쿠폰 재고)
-- KEYS[2] => claimedKey (쿠폰 수령 수)
-- ARGV[1] => userId

-- SISMEMBER : 키가 있는지 체크
if redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 1 then
    return 0 -- 이미 발급됨
end

local stock = redis.call('GET', KEYS[1])
if tonumber(stock) <= 0 then
    return -1 -- 소진
end

-- DECR : 값 감수
redis.cell('DECR', KEYS[1])
-- SADD : 값 추가
redis.call('SADD', KEYS[2], ARGV[1])
return 1 -- 발급성공
