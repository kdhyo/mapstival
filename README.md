# [MapStival] 2020 상반기 졸업작품

[맵스티벌[MapStival]페이지](http://kdhyo.kr)

### 개요

원하는 날, 원하는 지역에 어떤 축제가 있는지 알고 싶다는 생각으로 시작하게 된 프로젝트입니다.
전국에 있는 축제데이터들을 공공API를 활용하여 제공받았습니다. 그 후 사용자에게 제공할 때
사용자가 보기 편리하도록 구글맵API를 활용한 지도방식과
이미지를 활용하여 갤러리느낌으로 보여주는 방식으로 2가지 방식을 활용해보았습니다.

### 팀 역할분담

- [김동효](https://github.com/kdhyo) - 백엔드, 프론트엔드 및 서비스배포
- [최지율](https://github.com/wldbf97) - 백엔드, 프론트엔드
- [문승익] - 웹퍼블리싱

### 활용기술

- HTML5, CSS, JavaScript, JQuery
- NodeJS, Express, axios, EJS
- MySQL, sequelize
- AWS EC2
- GoogleMap API, NaverBlog API, Tour API

### 설치방법

```
1. Node 및 mysql 설치
2. 구글,네이버,공공데이터포털(한국관광공사) API Key 신청
3. /config 안 파일명 'ex-' 지우기
4. /config 폴더 안 api 키 적용 및 mysql 비밀번호 셋팅
5. npm install
6. npm start
```

## 사용기능

```
1. GoogleMap API, NaverBlog API, Tour API KEY config폴더에 분리
2. 키 정보 github 업로드 안되도록 gitignore 적용
3. 공공데이터포털 -> 국문 관광정보 서비스 안에 있는 행사정보 조회 API활용
4. Bootstrap 템플릿을 ejs템플릿과 결합하여 프론트엔드 구현
5. axios를 활용하여 API 조회
6. async/await 및 try/catch를 활용한 동기 처리방식 구현
7. 원하는 지역, 연도, 날짜를 선택 후 정보조회 구현
8. 원하는 축제 이미지를 클릭하여 축제 상세페이지 이동 구현
9. more버튼 클릭 시 축제메인페이지에 6개씩 추가로 축제 뿌려주기 및 더이상 축제정보가 없으면 버튼 hidden 구현
10. 축제 API / 구글맵 API 연동
11. 축제 위도경도 데이터를 통한 축제위치 구글맵에 연동 및 마커를 통해 보여주는 기능 구현
12. 마커 애니메이션 효과 구현
13. 축제 API / 네이버블로그 API 연동
14. 축제 상세페이지 안에 축제명을 활용하여 네이버 블로그 6가지 데이터 구현
15. 구글리뷰 API를 통해 축제명을 활용하여 축제 리뷰 및 평점 데이터 구현
16. 축제 메인페이지 및 구글맵 페이지에서 상세페이지로 연결
17. 상세페이지 안에 행사정보 조회를 활용한 상세정보 조회를 통한 API 활용하여 상세페이지 구축
18. npm sequelize 활용하여 mysql 연동
19. board 테이블 생성 및 연결
20. CRUD를 활용한 각 게시판 별 댓글 기능 구현
21. sha512 + salt를 활용하여 댓글 별 비밀번호 암호화기능 구현
22. AWS EC2 서비스 구축
23. AWS Mysql 서비스 구축
24. 개인 도메인 구매 후 AWS Route 53 사용
25. 개인 도메인과 AWS 서비스 연동 및 서비스 배포

-----2020/08/20 완료
26. axios를 ejs에서 활용하여 축제api 비동기 처리
27. 첫 detail 페이지 축제 API async/await를 활용한 동기방식 처리
28. detail 페이지 게시판 댓글 DB정보 비동기 방식 처리
```
