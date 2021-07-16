import { Context } from "koa";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
    
    static async getUserListByName (ctx: Context) {
        const users = await getCustomRepository(UserRepository).getUserListByName("nice");
        if (users.length == 0) {
            ctx.throw(404, { message: "NICE", isDelete: true });
        }

        ctx.status = 200
        ctx.body = {
            data: users
        }
    }

}