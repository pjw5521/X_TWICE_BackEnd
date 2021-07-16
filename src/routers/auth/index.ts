import Router from 'koa-router'
import { UserController } from '../../controllers/UserController';

const auth = new Router();
auth.get('/', UserController.getUserListByName)

export default auth;

