import { Response } from "koa";
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Params, Post, QueryParams, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { HistoryRepository } from "../repositories/HistoryRepository";
import { HistoryInsertInput } from "../models/HistoryInput";
import { TokenPayload } from "../types/tokens";
import { validate } from "class-validator";
import { BadRequestError, HttpError, NotFoundError } from "../error";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { HttpStatus } from "../types/http";
import { BadRequestResponse, NotFoundResponse, SuccessReponse } from "../types/swagger";
import { History } from "../entities/History";
import { GetPagnation } from "../models/PageQuery";

@JsonController("/histories")
export class HistoryController {

    private historyRepo: HistoryRepository;
    constructor() {
        this.historyRepo = getCustomRepository(HistoryRepository);
    }

    //거래내역 등록하기
    @HttpCode(200)
    @Post()
    @ResponseSchema(History, {
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
        summary: "토큰 등록",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse,
            ...BadRequestResponse
        },
    })
    async register(@Body() history: HistoryInsertInput/*, @CurrentUser() payload: TokenPayload,*/, @Res() { ctx }: Response) {
        //onst { user_num } = payload;
        history.user_num1 = 28
        
        const errors = await validate(history);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const isSuccess = await this.historyRepo.registerHistory(history);

        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

    //거래 내역 확인하기 
    @HttpCode(200)
    //@Authorized()
    @Get()
    @ResponseSchema(History, {
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
        summary: "거래 내역 조회",
        description: "해당 id의 history를 조회합니다.",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse,
            ...BadRequestResponse
        },
    })
    async getHistory(/*@CurrentUser() payload: TokenPayload, */ @QueryParams() query: GetPagnation, @Res() { ctx }: Response) {
        
        //const { user_num } = payload;
        //const corrent_user_num = user_num;
        const corrent_user_num = 28;

        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
         }

        const result = await this.historyRepo.getHistory(corrent_user_num, query);

        const history  = result[0]
        const count = result[1];
    
        ctx.body = {
            data: {
                items: history,
                count
            }
        }
    
         return ctx;
    }

    //user2 정보 확인하기
    @HttpCode(200)
    @Authorized()
    @Get("/user2")
    @ResponseSchema(History, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @OpenAPI({
        summary: "User2 정보 조회",
        responses: {
            ...SuccessReponse,
        },
    })
    async getUser2(@CurrentUser() payload: TokenPayload, @Param('token_id') token_id : string, @Res() { ctx }: Response) {
        
        const { user_num } = payload;
        const corrent_user_num = user_num;
    
        const result = await this.historyRepo.getUser2(corrent_user_num,token_id);

        const history  = result[0]
        const count = result[1];
    
        ctx.body = {
            data: {
                items: history,
                count
            }
        }
    
         return ctx;
    }

}
    