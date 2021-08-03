import { Context, Next } from "koa";
import { KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { HttpError } from "../error";
import { HttpName, HttpStatus } from "../types/http";

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