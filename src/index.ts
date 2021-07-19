import "reflect-metadata";
import { createConnection } from "typeorm";
import Koa from "koa";
import getDatabase from "./configs/database";
import {  useKoaServer } from "routing-controllers";
import { env } from "./env";
import { CustomErrorHandler/* , handleError */ } from "./middlewares/ErrorHandler";


// dotenv.config();

const bootstrap = async () => {
    try {
        const app = new Koa();

        const currentDir = __dirname; // 현재 디렉터리 경로

        const isProduction = env.isPRODUCTION; // 운영 환경 여부
        const isTest = env.isTEST; // 테스트 환경 여부
        const dirExt = isProduction || isTest ? 'js' : 'ts';

        const { connectionOptions } = getDatabase(currentDir, dirExt);
        await createConnection(connectionOptions[0]); 
        // console.log(connectionOptions);

        
        console.log('Success connected to Database');

        useKoaServer(app, {
            // cors: true,
            routePrefix: env.app.apiPrefix,
            controllers: [`${currentDir}/controllers/**/*.${dirExt}`],
            middlewares: [CustomErrorHandler],
            defaultErrorHandler: false
        });

        const PORT_NUMBER = env.app.portNumber;

        // koaApp.use(async (ctx, next) => await handleError(ctx, next))
        // koaApp.listen(PORT_NUMBER, '0.0.0.0', () => console.log(`Server running on port ${PORT_NUMBER}`));
        app.listen(PORT_NUMBER, '0.0.0.0', () => console.log(`Server running on port ${PORT_NUMBER}`));
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
        process.exit(1);
    }
}

bootstrap();