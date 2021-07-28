import { Response } from "koa";
import { Body, Get, HttpCode, JsonController, Param, Post, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { NotFoundError } from "../error";
import { History } from "../entities/History";
import { HistoryRepository } from "../repositories/HistoryRepository";

@JsonController("/histories")
export class HisyoryController {

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

     // 거래내역 확인하기 
     @HttpCode(200)
     @Get("/:user_num1")
     async getHistory(@Param('user_num1') user_num1: number, @Res() { ctx }: Response) {
        const history = await this.historyRepo.getHistory(user_num1);

        if (history.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: history
        }

        return ctx;
     }
}