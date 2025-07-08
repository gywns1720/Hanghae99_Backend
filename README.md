

# 항해 99 백앤드 Lite 1 

## 수강생

- 박효준

## 현재 브랜치

- week7 (7주차)

  이커머스 시나리오
  가장 많이 주문한 상품 랭킹을 Redis 기반으로 개발하고 설계 및 구현


### **커밋 설명**

_저번 주차 커밋_ : docker-compose redis cluster, mysql replication 셋팅 작업

**da20eb8** [링크](https://github.com/gywns1720/Hanghae99_Backend/commit/da20eb886b0119f355d98dd8a2195587ed48acbc) : 여유가 생겨 DB 빠르게 간소화 작업 진행 ( 2주차 때 테이블을 복잡하게 설정하여 여유가 생겨도 손이 가지 않는 현상으로 인해 필요한 부분만 적용)
**a2aa863** [링크](https://github.com/gywns1720/Hanghae99_Backend/commit/a2aa8635272df8aa1e46ec06079f79b13027ac2c) : 인터벌 10000ms 마다 Outbox 데이터 업데이트
- 10개 가져오기 -> 데이터 검증 -> 파싱 -> 레디스 zincrby 이용하여 랭킹데이터 등록 -> Outbox 상태 업데이트 -> 실패시 5회 트라이
- 3~5 주차 공백이 있어 그외 소스파일은 차차 추가예정

**7006942** [링크](https://github.com/gywns1720/Hanghae99_Backend/commit/7006942197c27f70d0c0ac1b5e4565d332d600ea)  : Redis 를 이용한 쿠폰 이벤트 로직 구현중
1. redis eval Lua 스크립트 이용하여 쿠폰의 상태 반환
2. 이벤트 쿠폰 생성, 쿠폰 발행 커맨드 함수 구현
3. 쿠폰 엔티티 간소하게 변경

**9f40176** [링크](https://github.com/gywns1720/Hanghae99_Backend/commit/9f401761938d1c1ebf1350d40c952ed8e6d61103) : 전략패턴을 이용하여 로그인 확장성 업데이트 (과제와는 관련 없음, 디자인 패턴 연습)
1. Passport 없이 디자인패턴을 이용한 서비스 구현중 

**453315d** [링크](https://github.com/gywns1720/Hanghae99_Backend/commit/453315dfadc8063b37b9063fd457dd4d6a87269a)  :  유저 관련 API 틀 작업 (과제와는 관련 없음, API 목업 작업)
1. 전략패턴 + 검증체크
2. controller 목업작업

**00d2809** [링크](https://github.com/gywns1720/Hanghae99_Backend/commit/00d280902f1dfeb99b6d839d69b3fc2c21e9ed14) : 아이디 중복 검사 체크 하기 위한 레디스 락 연습 

**3815457** [링크](https://github.com/gywns1720/Hanghae99_Backend/commit/38154573b216180105be4c36fe762dfc4ae9def2) :  a2aa863, 7006942 테스트 코드 작성

--- 
### **리뷰 받고 싶은 내용(질문)**

**7006942** : 다른 회사에서 백앤드 Redis 관련 작업을 Lua 스크립트를 자주 사용하나요?


---

### **과제 셀프 피드백**

1. 늦게 주차 다시 시작해도 빨리 따라가자.

### 기술적 성장

1. Redis Cluster Docker 자동화 셋팅
- UserACL : ACL 을 이용하여 계정 접속 가능하게 설정 및 권한 부여
- Conf 파일 : Redis.conf 파일을 Node 마다 생성해서 반본적인 작업을 nodejs 로 자동화

2. MySQL Replication 셋팅
- Docker 를 이용하여 Master-Slave 로 작성 (로컬 구동 확인)
