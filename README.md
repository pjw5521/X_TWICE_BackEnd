# X_TWICE_프로젝트명 개발 명세

## 개발 환경
- 언어 : Typescript
- 웹서버 : Koa
- DBMS, ORM : mysql, TypeORM
- GraphQL : TypeGraphQL, Apollo Server
- 인증 : jsonwebtoken

## 인증 처리
- 일반 사용자
    - JWT Token 사용
- 관리자 - 웹
    - 등록된 ID, PW를 통해 로그인

## 실행 명령어
- `npm run dev` : 개발 환경으로 실행
- `npm build` : build 파일 생성

## 디렉터리 및 파일
- `build` : 운영 환경이나 테스트 환경에서 배포
- `src` : 소스 코드 
    - `index.ts` : 서버 실행 ts 파일
    - `env.ts` : 환경변수 ts 파일
    - `entities` : Entity 관련 디렉터리
    - `controllers` : Controller 관련 디렉터리
- `.env` : 전역 환경 변수들(누출 유의, 누출 시 신속하게 변경 바람)
    ```
    NODE_ENV=현재 환경 변수 - production(프로덕션용), develop(개발용), test(테스트용)
    DB_HOST=DBMS 접속 경로
    DB_USERNAME=DBMS 접속 유저명
    DB_PASSWORD=DBMS 접속 비밀번호
    DB_DATABASE=DBMS 접속 데이터베이스명
    DB_CHARSET=DBMS 접속 캐릭터셋 - utf8mb4
    ```
- `.gitignore` : Git에 올릴 시 무시할 파일 및 파일의 이름이나 경로, 적용 시 `git rm -r --cached .` 명령어 입력
- `package.json` : npm 패키지 설정 파일
- `package.json.lock` : npm 패키지의 Lock 파일, 버전의 업그레이드 및 다운그레이드를 설치 때마다 Lock을 걸음
- `tsconfig.json` : Typescript 설정 파일

<br>
<hr>
<br>

# X_TWICE_프로젝트명 서버(Server)

## 서버 환경
- 운영체제 : Ubuntu 18.04 LTS
- GPU : NVIDIA GTX 1080 Ti

## NodeJS 설치
1. `curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -` 으로 NodeJS 10 저장소 위치를 변경
2. `sudo apt install nodejs` 으로 node js 설치
3. `node -v`로 NodeJS 버전 확인하고, `npm -v`으로 NPM 버전 확인
4. `sudo npm install -g yarn pm2`으로 전역으로 Yarn과 PM2를 설치

<br>
<hr>
<br>

# X_TWICE_프로젝트명 DB(Database)

## DB 환경
- DBMS : mysql 5.7 

## DB 파라미터 설정
- character_set_client : utf8mb4
- character_set_connection : utf8mb4
- character_set_database : utf8mb4
- character_set_filesystem : utf8mb4
- character_set_results : utf8mb4
- character_set_server : utf8mb4
- collation_connection : utf8mb4_unicode_ci
- collation_server : utf8mb4_unicode_ci
- time_zone : Asia/Seoul

## 포트 프로세스 충돌 시
- ``sudo kill -9 `sudo lsof -t -i:포트번호`` : 포토번호와 관련된 모든 프로세스를 종료

## DB별 계정 권한
- test : 개발용 DB
    - devadmin : CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT
    - devtest : INSERT, UPDATE, DELETE, SELECT
