import { validate } from "class-validator";
import { Response } from "koa";
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { BadRequestError, NotFoundError } from "../error";
import { UserInsertInput, UserLoginInput, UserUpdateInput } from "../models/UserInput";
import { GetMyListQuery } from "../models/UserQuery";
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
    async login(@Body() userInput: UserLoginInput, @Res() { ctx }: Response){
        
        const errors = await validate(userInput);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }
        
        const { user_id } = userInput;

        const user = await this.userRepo.getOneById(user_id);

        if (!user) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        const signToken = await this.tokenUtil.signToken(user);

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
    
      // 토큰정보 확인하기 조인
      @HttpCode(200)
      @Get("/mylist/:user_id")
      async getMyList(@Param('user_id') user_id: string, @QueryParams() query: GetMyListQuery, @Res() { ctx }: Response) {
          const tokens = await this.userRepo.getMyList(user_id, query);
  
          if (tokens.length == 0) {
              throw new NotFoundError("요청하신 결과가 없습니다.")
          }
  
          ctx.body = {
              data: tokens
          }
  
          return ctx;
      }

}