import { Context, Next } from "koa";
import { Action, KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { HttpError, UnauthorizedError } from "../error";
import { HttpName, HttpStatus } from "../types/http";
import { TokenUtil } from "../utils/TokenUtil";

@Middleware({ type: "before", priority: 50 })
export class CustomErrorHandler implements KoaMiddlewareInterface {
    async use(ctx: Context, next: Next) {
        try{
            await next()
        } catch (err) {
            const { status, name, message, extensions, stack } = err as HttpError;
            //const currentStatus = status || HttpStatus.internal_server;
            //const currentName = name || HttpName.internal_server
            console.log(stack)
    
            // ctx.status = currentStatus;
            ctx.body = {
                status: status || HttpStatus.internal_server,
                name: name || HttpName.internal_server,
                message: message,
                extensions: extensions
            };
    
            ctx.app.emit('error', err, ctx);
        }
    }
}

const tokenUtil = new TokenUtil();

export async function authorizationCheker (action: Action, roles: string[]) {
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
}

export async function currentUserChecker (action: Action) {
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