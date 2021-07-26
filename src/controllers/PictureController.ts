import { Response } from "koa";
import { Body, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { getCustomRepository, LockNotSupportedOnGivenDriverError } from "typeorm";
import { NotFoundError } from "../error";
import { Picture } from "../entities/Picture";
import { PictureRepository } from "../repositories/PictureRepository";

@JsonController("/pictures")
export class PictureController {

    private pictureRepo: PictureRepository;
    constructor() {
        this.pictureRepo = getCustomRepository(PictureRepository);
    }

    // 사진 등록하기
    @HttpCode(200)
    @Post()
    async register(@Body() picture: Picture, @Res() { ctx }: Response) {
        const isSuccess = await this.pictureRepo.saveWithOptions(picture);

        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

    // 사진 정보 수정하기
    @HttpCode(200)
    @Put("/update")
    async update(@Body() picture: Picture, @Res() { ctx }: Response) { 
        const isSuccess  = await this.pictureRepo.saveWithOptions(picture);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

    // 판매 토큰으로 등록하기 
    @HttpCode(200)
    @Put("/sale")
    async registeSale(@Body() price: number, token_id: string /* Input 파일 하나 만들기 */, @Res() { ctx }: Response) { 
        const isSuccess  = await this.pictureRepo.registerSale(price, token_id);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

    // 판매 취소(보유 중인 상태로 변경) 
    @HttpCode(200)
    @Put("/state")
    async cancleSale(@Body() token_id: string, @Res() { ctx }: Response) { 
        const isSuccess  = await this.pictureRepo.cancleSale(token_id);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

    // 토큰정보 확인하기 => QueryString 알려주기 
    @HttpCode(200)
    @Get("/:user_num")
    async getList(@Param('user_num') user_num: number, state: string, @Res() { ctx }: Response) {
        const picture = await this.pictureRepo.getList(user_num, state);

        if (picture.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: picture
        }

        return ctx;
    }

    // 키워드별 사진 검색하기
    @HttpCode(200)
    @Get()
    async search(keyword: string, @Res() { ctx }: Response) {
        const search = await this.pictureRepo.search(keyword);

        if (search.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: search
        }

        return ctx;
    }

}