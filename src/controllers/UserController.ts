import { validate } from "class-validator";
import { Response } from "koa";
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { getCustomRepository } from "typeorm";
import { User } from "../entities/User";
import { BadRequestError, HttpError, NotFoundError } from "../error";
import { UserInsertInput, UserLoginInput, UserUpdateInput } from "../models/UserInput";
import { UserRepository } from "../repositories/UserRepository";
import { HttpStatus } from "../types/http";
import { BadRequestResponse, NotFoundResponse, SuccessReponse } from "../types/swagger";
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
            data: users
        }

        return ctx;
    }

    @HttpCode(200)
    @Get("/:id")
    @ResponseSchema(User, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @OpenAPI({
        summary: "회원정보 조회",
        description: '해당 id의 회원 정보를 조회합니다.',
        responses: {
            ...SuccessReponse,
        },
    })
    async getOne(@Param('id') id: string, @Res() { ctx }: Response) {
        const user = await this.userRepo.getOne(id);

        ctx.body = {
            data: user
        }

        return ctx;
    }

    @HttpCode(200)
    @Post()
    @ResponseSchema(User, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.not_found,
    })
    @OpenAPI({
        summary: "회원가입",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse
        },
    })
    async insert(@Body() userInput: UserInsertInput, @Res() { ctx }: Response) {
        const errors = await validate(userInput);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }
        
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
    @ResponseSchema(User, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.not_found,
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.bad_request,
    })
    @OpenAPI({
        summary: "로그인",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse,
            ...BadRequestResponse
        },
    })
    async login(@Body() userInput: UserLoginInput, @Res() { ctx }: Response){
        
        const errors = await validate(userInput);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }
        
        const { user_id, user_password } = userInput;

        const user = await this.userRepo.getOneById(user_id, user_password);

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
    @ResponseSchema(User, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.bad_request,
    })
    @OpenAPI({
        summary: "회원 정보 수정",
        responses: {
            ...SuccessReponse,
            ...BadRequestResponse
        },
    })
    async update(@CurrentUser() payload: TokenPayload, @Body() user: UserUpdateInput, @Res() { ctx }: Response) {
       
        const { user_num } = payload;
        user.user_num = user_num;

        const errors = await validate(user);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const updatedUser = await this.userRepo.updateWithOptions(user);

        ctx.body = {
            data: updatedUser
        }

        return ctx;
    }

}