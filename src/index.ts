import "reflect-metadata";
import { createConnection } from "typeorm";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import * as dotenv from 'dotenv';
import router from "./routers";
import getDatabase from "./configs/database";
import handleError from "./middlewares/ErrorHandler";


dotenv.config();

const bootstrap = async () => {
    try {
        const app = new Koa();

        const currentDir = __dirname; // 현재 디렉터리 경로

        const IS_PRODUCTION = process.env.NODE_ENV == "production"; // 운영 환경 여부
        const IS_TEST = process.env.NODE_ENV == "test"; // 테스트 환경 여부
        const dirExt = IS_PRODUCTION || IS_TEST ? 'js' : 'ts';

        const { connectionOptions } = getDatabase(currentDir, dirExt);
        // console.log(connectionOptions);

        await createConnection(connectionOptions[0]); 
        console.log('Success connected to Database');

        app.use(bodyParser())
        app.use(async (ctx, next) => await handleError(ctx, next));

        
        app.use(router.routes())
            .use(router.allowedMethods());

        const PORT_NUMBER = process.env.PORT || 4000;
        app.listen(PORT_NUMBER as number, '0.0.0.0', () => console.log(`Server running on port ${PORT_NUMBER}`));
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
        process.exit(1);
    }
}

bootstrap();