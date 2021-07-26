import { Response } from "koa";
import { Body, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { getCustomRepository, LockNotSupportedOnGivenDriverError } from "typeorm";
import { NotFoundError } from "../error";
import { History } from "../entities/History";
import { HistoryRepository } from "../repositories/HistoryRepository";

export class HisyoryController {

    private HistoryRepo: HistoryRepository;
    constructor() {
        this.HistoryRepo = getCustomRepository(HistoryRepository);
    }

    //거래내역 등록하기
    @HttpCode(200)
    @Post()
    async register(@Body() history: History, @Res() { ctx }: Response) {
        const isSuccess = await this.HistoryRepo.registerHistory(history);

        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

     // 거래내역 확인하기 
     @HttpCode(200)
     @Get("/:user_num")
     async getToken(@Param('user_num') user_num: number, @Res() { ctx }: Response) {
         const history = await this.HistoryRepo.getHistory(user_num);
 
         if (history.length == 0) {
             throw new NotFoundError("요청하신 결과가 없습니다.")
         }
 
         ctx.body = {
             data: history
         }
 
         return ctx;
     }
}