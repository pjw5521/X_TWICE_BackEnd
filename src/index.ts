import "reflect-metadata";
import { createConnection } from "typeorm";
import Koa from "koa";
import getDatabase from "./configs/database";
import { Action, getMetadataArgsStorage, RoutingControllersOptions, useKoaServer } from "routing-controllers";
import { env } from "./env";
import { CustomErrorHandler } from "./middlewares/ErrorHandler";
import * as dotenv from "dotenv";
import { TokenUtil } from "./utils/TokenUtil";
import { UnauthorizedError } from "./error";
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
        const tokenUtil = new TokenUtil();

        const routingControllerOptions: RoutingControllersOptions =  {
            routePrefix: env.app.apiPrefix,
            controllers: [`${currentDir}/controllers/**/*.${dirExt}`],
            middlewares: [CustomErrorHandler],
            defaultErrorHandler: false,
            validation: false,
            authorizationChecker: async (action: Action, roles: string[]) => {
                try {
                    const token = action?.request?.headers?.authorization;

                    console.log(token);
                
                    let user = undefined;

                    if (token) {
                        user = await tokenUtil.veriftyToken(token);
                    }

                    if (user && !roles.length) {
                        // console.log("true")
                        return true;
                    }
                    // if (user && roles.find(role => user.roles.indexOf(role) !== -1)) return true;
                    
                    // console.log("false")
                    throw new UnauthorizedError('잘못된 인증 정보입니다.')
                } catch (err) {
                    throw new UnauthorizedError('잘못된 인증 정보입니다.')
                }
            },
            currentUserChecker: async (action: Action) => {
                try {
                    const token = action?.request?.headers?.authorization;
                
                    let user = undefined;

                    if (token) {
                        user = await tokenUtil.veriftyToken(token);
                    }

                    if (user) {
                        return user;
                    }

                    throw new UnauthorizedError('잘못된 인증 정보입니다.')
                } catch (err) {
                    throw new UnauthorizedError('잘못된 인증 정보입니다.')
                }
            }
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