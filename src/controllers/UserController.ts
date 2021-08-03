import { validate } from "class-validator";
import { Response } from "koa";
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { getCustomRepository } from "typeorm";
import { User } from "../entities/User";
import { BadRequestError, HttpError, NotFoundError } from "../error";
import { GetPagnation } from "../models/PageQuery";
import { UserInsertInput, UserLoginInput, UserUpdateInput } from "../models/UserInput";
import { GetMyListQuery } from "../models/UserQuery";
import { UserRepository } from "../repositories/UserRepository";
import { HttpStatus } from "../types/http";
import { NotFoundResponse, SuccessReponse } from "../types/swagger";
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
    
    @HttpCode(HttpStatus.success)
    @Get()
    @ResponseSchema(User, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.not_found,
    })
    @OpenAPI({
        summary: "유저 목록 조회",
        description: '유저 목록 가져옵니다.',
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse
        },
    })
    async getUserListByName (@Res() { ctx }: Response) {
        const users = await this.userRepo.getUserListByName("test");
        
        if (users.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }
        
        ctx.body = {
            // status: HttpStatus.success,
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
    async insert(@Body() userInput: UserInsertInput, @Res() { ctx }: Response) {
        const userInsertResult = await this.userRepo.insertWithOptions(userInput);

        const { generatedMaps, identifiers } = userInsertResult;
        const user = generatedMaps?.[0] || identifiers?.[0]

        if (!user) {
            throw new NotFoundError("처리된 회원정보를 찾지 못했습니다.");
        }

        ctx.body = {
            data: user
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

     // 거래내역 확인하기 조인
     @HttpCode(200)
     @Get("/history/:user_num1")
     async getHistory(@Param('user_num1') user_num1: number,  @QueryParams() query: GetPagnation, @Res() { ctx }: Response) {
        const history = await this.userRepo.getHistory(user_num1, query);

        if (history.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: history
        }

        return ctx;
     }

}