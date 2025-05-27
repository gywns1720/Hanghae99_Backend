


# ERD 

## User 

![유저 ERD](../assets/UserERD.png)

### local_sign

- email : 로그인할 이메일
- pw : 로그인할 비밀번호

### user_master

- u_id : 유저 PK
- is_cookie_approval : 쿠키 허가 여부
- is_personal_information : 개인정보 동의 여부
- approval_information : 동의한 정보 리스트 (콤마로 구분) 기본값 : `email`
- auth : 권한 설정  
  - 0 -> 게스트
  - 1 -> 일반등급 회원
  - 2 -> 우수등급 회원
  - 3 -> VIP 
  - 4 -> Admin 
- is_blacklist : 블랙리스트 인가?
- created_at : 계정 생성 날짜
- login_at : 최신 로그인 날짜
- logout_at : 최신 로그아웃 날짜

### user_profile

- u_id : 유저 PK
- name : 유저 이름
- email : 유저 이메일
- jit_code : JWT 토큰 검증용
- birth_date : 생년월일
- point : 현재 포인트


### user_point_history

- p_id : 포인트 PK
- u_id : 유저 PK
- indate : 검색용 INDEX
- type : 충전인가, 사용인가, 환불인가?
- point : 사용한 포인트
- created_at : 생성된 날짜
- 
### user_payment_history

- p_id : 포인트 PK
- u_id : 유저 PK
- pg_id : PG 사
- pay_type : 결재 방식 타입 (0 -> card)
- message : 결제 영수증 JSON 직렬화
- created_at : 생성된 날짜

---
