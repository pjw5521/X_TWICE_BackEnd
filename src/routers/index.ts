import Router from 'koa-router'
import auth from './auth';

const router = new Router();

router.get('/', (ctx, _) => {
    ctx.body = {
        data: 'home'
    }
})

router.use('/auth', auth.routes());

export default router;

