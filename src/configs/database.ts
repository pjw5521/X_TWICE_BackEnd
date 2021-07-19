import { ConnectionOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();
 
export default function getDatabase(currentDir: string, dirExt: string) {
    const entitiesDir = 'entities';

    const entitiesPath: string[] = [
        `${currentDir}/${entitiesDir}/**/*.${dirExt}`,
    ]

    /* TypeORM 설정 */
    const connectionOptions: ConnectionOptions[] = [
        {   
            //name: "default",
            type: "mysql", // DBMS 종류
            host: process.env.DB_HOST, // 접속 URL
            port: parseInt(process.env.DB_PORT), // 접속 포트
            username: process.env.DB_USERNAME, // 접속 아이디
            password: process.env.DB_PASSWORD, // 접속 비밀번호
            database: process.env.DB_DATABASE, // 데이터베이스명
            charset: process.env.DB_CHARSET, // 문자열
            synchronize: false, // 동기화 - 절대 true로 사용하지 마시오!!
            // DB table 모두 생성 후 false로 바꾸기 
            logging: 'all', // Query 로그 종류
            connectTimeout: 3000, // Connection 타임아웃
            maxQueryExecutionTime: 1000, // Query 최대 실행시간
            entities: entitiesPath, // Entity 경로들
            extra: {
                connectionLimit: 5, // 최대 Connection Pool 개수
            },
        },
    ];

    return { connectionOptions }
}