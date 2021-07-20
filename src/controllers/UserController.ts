import { Response } from "koa";
import { Body, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

@JsonController("/users")
export class UserController {

    private userRepo: UserRepository;
    constructor() {
        this.userRepo = getCustomRepository(UserRepository);
    }
    
    //@HttpCode(200)
    //@Get()
    async getUserListByName (@Res() { ctx }: Response) {
        const users = await this.userRepo.getUserListByName("ni");
        console.log(users);
        
        if (users.length > 0) {
            // return ctx.throw(404, { message: "NICE", isDelete: true });
            throw new Error('nice')
        }
        
        ctx.body = {
            data: users
        }

        return ctx;
    }

    @HttpCode(200)
    @Get("/:id")
    async getOne(@Param('id') id: string, @Res() { ctx }: Response) {
        const user = await this.userRepo.getOne(id);

        // ctx.status = 200
        ctx.body = {
            data: user
        }

        return ctx;
    }

    @HttpCode(200)
    @Post()
    async insert(@Body() user: User, @Res() { ctx }: Response) {
        const isSuccess = await this.userRepo.insertWithOptions(user);

        // ctx.status = 200
        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

    @HttpCode(200)
    @Put()
    async update(@Body() user: User, @Res() { ctx }: Response) {
        // console.log(JSON.stringify(user, null, 2));
        const updatedUser = await this.userRepo.updateWithOptions(user);
        
        // const isSuccess = !!updatedUser?.user_num;

        ctx.body = {
            data: updatedUser
        }

        return ctx;
    }




}