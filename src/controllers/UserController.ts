import { Response } from "koa";
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { NotFoundError } from "../error";
import { UserInsertInput, UserUpdateInput } from "../models/UserInput";
import { UserRepository } from "../repositories/UserRepository";
import { TokenPayload } from "../types/tokens";
import { TokenUtil } from "../utils/TokenUtil";

@JsonController("/users")
export class UserController {

    private userRepo: UserRepository;
    private tokenUtil: TokenUtil;

    constructor() {
        this.userRepo = getCustomRepository(UserRepository);
        this.tokenUtil = new TokenUtil();
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
    @Post("/login")
    async login(@Res() { ctx }: Response){
        const signToken = await this.tokenUtil.signToken();

        ctx.body = {
            data: signToken
        }

        return ctx;
    }

    @HttpCode(200)
    @Authorized()
    @Put()
    async update(@CurrentUser() payload: TokenPayload, @Body() user: UserUpdateInput, @Res() { ctx }: Response) {
        console.log(payload);
        const updatedUser = await this.userRepo.updateWithOptions(user);

        ctx.body = {
            data: updatedUser
        }

        return ctx;
    }

}