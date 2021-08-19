# X_TWICE_프로젝트명 개발 명세

## 개발 환경
- 언어 : Typescript
- 웹서버 : Koa
- DBMS, ORM : mysql, TypeORM
- 인증 : jsonwebtoken

## 인증 처리
- 일반 사용자
    - JWT Token 사용
- 관리자 - 웹
    - 등록된 ID, PW를 통해 로그인

## 실행 명령어
- `npm run dev` : 개발 환경으로 실행
- `npm run start` : pm2로 실행
- `npm run restart` : 기존 pm2 프로세스 삭제 후 재실행 
- `npm run build` : build 파일 생성
- `npm run rebuild` : 기존 build 파일 삭제 후 재생성 

## 디렉터리 및 파일
- `build` : 운영 환경이나 테스트 환경에서 배포
- `src` : 소스 코드 
    - `index.ts` : 서버 실행 ts 파일
    - `env.ts` : 환경변수 ts 파일
    - `configs` : Typeorm 설정 관련 디렉터리
    - `entities` : Entity 관련 디렉터리
    - `controllers` : Controller 관련 디렉터리
    - `middlewares` : Middleware 관련 디렉터리
    - `models` : validation 관련 디렉터리
    - `types` : Data, HttpStatus, Swagger, Jsonwebtoken 관련 type 정의 디렉터리
    - `utils` : Jsonwebtoken 관련 디렉터리
- `.env` : 전역 환경 변수들(누출 유의, 누출 시 신속하게 변경 바람)
    ```
    NODE_ENV=현재 환경 변수 - production(프로덕션용), develop(개발용), test(테스트용)
    DB_HOST=DBMS 접속 경로
    DB_PORT=DBMS 접속 포트 번호
    DB_USERNAME=DBMS 접속 유저명
    DB_PASSWORD=DBMS 접속 비밀번호
    DB_DATABASE=DBMS 접속 데이터베이스명
    DB_CHARSET=DBMS 접속 캐릭터셋 - utf8mb4
    ```
- `.gitignore` : Git에 올릴 시 무시할 파일 및 파일의 이름이나 경로, 적용 시 `git rm -r --cached .` 명령어 입력
- `package.json` : npm 패키지 설정 파일
- `package.json.lock` : npm 패키지의 Lock 파일, 버전의 업그레이드 및 다운그레이드를 설치 때마다 Lock을 걸음
- `tsconfig.json` : Typescript 설정 파일
- `ecosystem.config.js` : pm2 실행 환경 설정 파일
   ```
   name : 프로세스 이름
   script : 실행시킬 파일 경로
   env : 배포 환경
   ```
   
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

## Gunicorn 실행 
1. `pip install gunicorn`으로 gunicorn 설치
2. `gunicorn server:app -b 0.0.0.0 --daemon --access-logfile ./gunicorn-access.log --error-logfile ./gunicorn-error.log`으로 실행. 
    defalt port 번호는 8000으로 모든 아이피에 대해 8000 port 접속 허용. reload 시 같은 명령어 사용 가능.
- `pkill gunicorn` : gunicorn 프로세스 종료
- `./gunicorn-access.log`, `./gunicorn-error.log` 위치에서 access, error log 확인 가능

## 특정 Port 오픈 시
- `sudo iptables -I INPUT 1 -p tcp --dport 포트번호 -j ACCEPT` : 외부에서 내부로 들어오는 TCP 포트번호를 1번 방확벽 규칙으로 추가

## 오픈되어 있는 Port 확인 시
- `netstat -nap` : 열려있는 port 리스트 출력 

## torchserve 외부 접속 허용 Port 오픈 시 
1. TorchServe용 구성 파일인 config.properties(기본 이름)를 생성하여 원격 접속 주소 설정
  ```
  inference_address = Inference API 바인딩 주소. Default: http://127.0.0.1:8080
  management_address = Management API 바인딩 주소. Default: http://127.0.0.1:8081
  ```
2. torchserve 실행 시 같은 디렉토리에서 실행하거나 --ts-config으로 경로 지정 

## 포트 프로세스 충돌 시
- ``sudo kill -9 `sudo lsof -t -i:포트번호`` : 포토번호와 관련된 모든 프로세스를 종료

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

## DB별 계정 권한
- test : 개발용 DB
    - root : 모든 권한

## mysql port open 시 
1. `sudo nano /etc/mysql/my.cnf` 또는 `sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf`으로 mysql 설정 관련 cnf 파일 오픈 
2. `bind-address = 127.0.0.1`, `mysqlx-bind-address = 127.0.0.1` 주석 처리 
3. `sudo service mysql restart`으로 mysql 재시작 