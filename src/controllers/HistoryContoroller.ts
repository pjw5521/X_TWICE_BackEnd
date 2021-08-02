import { Response } from "koa";
import { Body, Get, HttpCode, JsonController, Param, Post, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { NotFoundError } from "../error";
import { History } from "../entities/History";
import { HistoryRepository } from "../repositories/HistoryRepository";

@JsonController("/histories")
export class HistoryController {

    private historyRepo: HistoryRepository;
    constructor() {
        this.historyRepo = getCustomRepository(HistoryRepository);
    }

    //거래내역 등록하기
    @HttpCode(200)
    @Post()
    async register(@Body() history: History, @Res() { ctx }: Response) {
        const isSuccess = await this.historyRepo.registerHistory(history);

        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

}