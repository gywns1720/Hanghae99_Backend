

# 항해 99 백앤드 Lite 1 

## 수강생

- 박효준

## 현재 브랜치

- week2 (2주차)

### 과제

- 아키텍쳐 정보 링크 : [README.md](./architecture/README.md)
- 마일 스톤 [Projects 링크](https://github.com/users/gywns1720/projects/5)
- 다이어그램 링크 : [들어가기](https://app.eraser.io/workspace/Bl90uXnhwK6mQO5Ho7od)

[//]: # (- 설계 : [들어가기]&#40;./architecture/erd&#41;)
> 링크 안들어가질 경우 
> ```text
> https://github.com/users/gywns1720/projects/5
> ```

### 구현해야할 항목

#### Description

- `e-커머스 상품 주문 서비스`를 구현해 봅니다.
- 상품 주문에 필요한 메뉴 정보들을 구성하고 조회가 가능해야 합니다.
- 사용자는 상품을 여러개 선택해 주문할 수 있고, 미리 충전한 잔액을 이용합니다.
- 상품 주문 내역을 통해 판매량이 가장 높은 상품을 추천합니다.

#### Requirements

- 아래 4가지 API 를 구현합니다.
    - 잔액 충전 / 조회 API
    - 상품 조회 API
    - 주문 / 결제 API
    - 인기 판매 상품 조회 API
- 각 기능 및 제약사항에 대해 단위 테스트를 반드시 하나 이상 작성하기
- 다수의 인스턴스로 어플리케이션 동작하더라도 기능에 문제 없도록 작성
- 동시성 이슈 고려하여 구현
- 재고 관리에 문제 없도록 구현

#### API Specs

- 잔액충전 / 조회 API (**필수**)
- 상품 조회 API (기본)
- 선착순 쿠폰 기능 (**필수**)
- 주문 / 결제 API (**필수**)
- 상위 상품 조회 API (기본)

#### 심화 과제 

- Mock API 및 Swagger API 코드 작성
- API E2E 테스트 작성

---
