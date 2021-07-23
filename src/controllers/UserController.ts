import { Response } from "koa";
import { Body, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { NotFoundError } from "../error";
import { UserInsertInput, UserUpdateInput } from "../models/UserInput";
import { UserRepository } from "../repositories/UserRepository";

@JsonController("/users")
export class UserController {

    private userRepo: UserRepository;
    constructor() {
        this.userRepo = getCustomRepository(UserRepository);
    }
    
    @HttpCode(200)
    @Get()
    async getUserListByName (@Res() { ctx }: Response) {
        const users = await this.userRepo.getUserListByName("ni");
        
        if (users.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
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

        ctx.body = {
            data: user
        }

        return ctx;
    }

    @HttpCode(200)
    @Post()
    async insert(@Body() user: UserInsertInput, @Res() { ctx }: Response) {
        const isSuccess = await this.userRepo.insertWithOptions(user);

        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

    @HttpCode(200)
    @Put()
    async update(@Body() user: UserUpdateInput, @Res() { ctx }: Response) {
        const updatedUser = await this.userRepo.updateWithOptions(user);

        ctx.body = {
            data: updatedUser
        }

        return ctx;
    }




}