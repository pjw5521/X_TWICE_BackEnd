import { Response } from "koa";
import { Body, CurrentUser, Get, HttpCode, JsonController, Param, Post, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { HistoryRepository } from "../repositories/HistoryRepository";
import { HistoryInsertInput } from "../models/HistoryInput";
import { TokenPayload } from "../types/tokens";
import { validate } from "class-validator";
import { BadRequestError, HttpError } from "../error";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { HttpStatus } from "../types/http";
import { BadRequestResponse, NotFoundResponse, SuccessReponse } from "../types/swagger";
import { History } from "../entities/History";

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
    async register(@Body() history: HistoryInsertInput, @CurrentUser() payload: TokenPayload, @Res() { ctx }: Response) {
        const { user_num } = payload;
        history.user_num1 = user_num;
        
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

}