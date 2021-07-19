import { Context, Next } from "koa";
import { KoaMiddlewareInterface, Middleware } from "routing-controllers";

/* const handleError = async (ctx: Context, next: Next) => {
    try{
        await next()
    } catch (err) {
        const { statusCode, status } = err;
        const currentStatus = statusCode || status || 500;

        console.log(err);
        ctx.status = currentStatus;
        ctx.body = {
            status: currentStatus,
            ...err
        };

        ctx.app.emit('error', err, ctx);
    }
}

export default handleError */

@Middleware({ type: "before", priority: 50 })
export class CustomErrorHandler implements KoaMiddlewareInterface {
    async use(ctx: Context, next: Next) {
        try{
            await next()
        } catch (err) {
            const { statusCode, status } = err;
            const currentStatus = statusCode || status || 500;
    
            ctx.status = currentStatus;
            ctx.body = {
                status: currentStatus,
                ...err
            };
    
            ctx.app.emit('error', err, ctx);
        }
    }
}