import Router from 'koa-router'
import { UserController } from '../../controllers/UserController';

const user = new Router();
// auth.get('/users', UserController.getUserListByName)
user.get('/', UserController.getOne)

export default user;

