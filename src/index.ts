import "reflect-metadata";
import { createConnection } from "typeorm";
import Koa from "koa";
import getDatabase from "./configs/database";
import { Action, getMetadataArgsStorage, RoutingControllersOptions, useKoaServer } from "routing-controllers";
import { env } from "./env";
import { authorizationCheker, currentUserChecker, CustomErrorHandler } from "./middlewares/ErrorHandler";
import * as dotenv from "dotenv";
import cors from "@koa/cors"
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { koaSwagger } from "koa2-swagger-ui";
import Router from "koa-router";


const bootstrap = async () => {
    try {
        const app = new Koa();

        const currentDir = __dirname; // 현재 디렉터리 경로
        const isProduction = env.isPRODUCTION; // 운영 환경 여부
        const dirExt = isProduction /* || isTest */? 'js' : 'ts';

        
        /* DotEnv 연동 */
        const envPath = isProduction ? ".env.production" : ".env"
        console.log("env path : " + envPath)
        dotenv.config({ path: envPath });


        /* DB 연동 */
        const { connectionOptions } = getDatabase(currentDir, dirExt);
        await createConnection(connectionOptions[0]); 
        // console.log(connectionOptions[0]);
        console.log('Success connected to Database');


        /* Cors 연동 */
        app.use(cors());
        

        /* Routing -Controllers 연동 */
        const routingControllerOptions: RoutingControllersOptions =  {
            routePrefix: env.app.apiPrefix,
            controllers: [`${currentDir}/controllers/**/*.${dirExt}`],
            middlewares: [CustomErrorHandler],
            defaultErrorHandler: false,
            validation: false,
            authorizationChecker: async (action: Action, roles: string[]) => await authorizationCheker(action, roles),
            currentUserChecker: async (action: Action) => await currentUserChecker(action)
        };

        useKoaServer(app, routingControllerOptions);


        /* Swagger 연동 */
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
        })
        const storage = getMetadataArgsStorage()
          
        const spec = routingControllersToSpec(storage, routingControllerOptions, {
            components: { schemas },
            info: { title: 'X_TWICE_BackEnd', version: '1.0.0' },
        })

        // console.log(JSON.stringify(spec.paths, null, 2));
        // console.log(JSON.stringify(spec.components.schemas, null, 2));

        const router = new Router();

        router.use(koaSwagger({ swaggerOptions: { spec } }));
        router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

        app.use(router.routes());
        
        
        /* Port 출력 */
        const PORT_NUMBER = env.app.portNumber;

        app.listen(PORT_NUMBER, '0.0.0.0', () => console.log(`Server running on port ${PORT_NUMBER}`));
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
        process.exit(1);
    }
}

bootstrap();