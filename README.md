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

### nginx 설정 
1. `sudo apt-get install nginx` nginx 설치
2. `sudo nano /etc/nginx/nginx.conf` nginx 설정 파일 오픈 
3. 아래 내용 추가 ( https ssl 인증서는 standalone 사용 )  
    ```
    server{ 
        listen 443 ssl default_server; 
        listen [::]:443 ssl default_server; // 443 : Https default server 
    
        index index.html index.htm index.nginx-debian.html 
        server_name sw.uos.ac.kr; // server 이름 
        ssl_certificate /etc/letsencrypt/live/sw.uos.ac.kr/fullchain.pem; // https ssl 인증서 공개키 
        ssl_certificate_key /etc/letsencrypt/live/sw.uos.ac.kr/privkey.pem; // https ssl 인증서 비밀키
        location / {
            proxy_pass http://172.16.163.74:4004; // 4004 rontend 포트 번호 
        }

        location /backend/ {
            proxy_pass http://172.16.163.74:4000/; // 4000 rontend 포트 번호 
        }

        location /ai/ {
            proxy_pass http://172.16.163.74:8000/; // 8000 rontend 포트 번호
        }
    }   
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

## 특정 Port 오픈 시
- `sudo iptables -I INPUT 1 -p tcp --dport 포트번호 -j ACCEPT` : 외부에서 내부로 들어오는 TCP 포트번호를 1번 방화벽 규칙으로 추가

## 오픈되어 있는 Port 확인 시
- `netstat -nap` : 열려있는 port 리스트 출력 

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

## mysql 접속 
- `sudo mysql -u root -p` : mysql에 root로 접속 

## mysql 사용자 조회
1. `use mysql`
2. `select user, host from user`  
