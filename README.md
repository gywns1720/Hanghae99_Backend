

# 항해 99 백앤드 Lite 1 

## 수강생

- 박효준

## 현재 브랜치

- week3 (3주차)


## 구조 설정

- 모놀리식 변경 

### 레이아웃

- 컨트롤러 -> Service -> Command Or Query -> Repository


### apps

#### gateway-server

- 메인 서버 (마이크로서비스 변경시 Gateway Server 역활)

### Libs

#### common

- 모든 libs 혹은 apps 에 공통으로 사용할 라이브러리 모음

#### e-commerce

- e-commerce 관련된 라이브러리 뭉침
  - **product** : 상품
  - **order** : 주문
  - **payment** : 결제

#### backup

- 이 라이브러리는 기존에 있던 소스파일을 이곳에 백업해 두는 역활

### 과제

#### 추가 설치

```bash
npm install --save @nestjs/cqrs
```

#### 아키텍쳐

- CQRS 패턴 사용
- 
