import { Context, Next } from "koa";
import { KoaMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: "before", priority: 50 })
export class CustomErrorHandler implements KoaMiddlewareInterface {
    async use(ctx: Context, next: Next) {
        try{
            await next()
        } catch (err) {
            const { status, name, message, extensions, stack } = err;
            const currentStatus = status || 500;
            console.log(stack)
    
            ctx.status = currentStatus;
            ctx.body = {
                status: currentStatus,
                name: name,
                message: message,
                extensions: extensions
            };
    
            ctx.app.emit('error', err, ctx);
        }
    }
}