import Router from 'koa-router'
import user from './user';

const router = new Router();

router.get('/', (ctx, _) => {
    ctx.body = {
        data: 'home'
    }
})

router.use('/users', user.routes());

export default router;

