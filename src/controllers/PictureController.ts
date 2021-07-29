import { Response } from "koa";
import { Body, Get, HttpCode, JsonController, Param, Post, Put, QueryParams, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { BadRequestError, NotFoundError } from "../error";
import { Picture } from "../entities/Picture";
import { PictureRepository } from "../repositories/PictureRepository";
import { GetMyListQuery } from "../models/UserQuery";
import { GetPagnation } from "../models/PageQuery";
import { PictureSaleInput } from "../models/PictureInput";

@JsonController("/pictures")
export class PictureController {

    private pictureRepo: PictureRepository;
    constructor() {
        this.pictureRepo = getCustomRepository(PictureRepository);
    }

    // 사진 등록하기
    @HttpCode(200)
    @Post()
    async save(@Body() picture: Picture, @Res() { ctx }: Response) {
        const isSuccess = await this.pictureRepo.saveWithOptions(picture);

        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

    // 사진 정보 수정하기
    @HttpCode(200)
    @Put()
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
    async registerSale(@Body() picture: PictureSaleInput, @Res() { ctx }: Response) { 
        const isSuccess  = await this.pictureRepo.registerSale(picture);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

    // 판매 취소(보유 중인 상태로 변경) 
    @HttpCode(200)
    @Put("/cancle/:token_id")
    async cancleSale(@Param('token_id') token_id: string, @Res() { ctx }: Response) { 
        const isSuccess  = await this.pictureRepo.cancleSale(token_id);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

    // 토큰정보 확인하기 
    @HttpCode(200)
    @Get("/:user_num")
    async getMyList(@Param('user_num') user_num: number, @QueryParams() query: GetMyListQuery, @Res() { ctx }: Response) {
        const tokens = await this.pictureRepo.getMyList(user_num, query);

        if (tokens.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: tokens
        }

        return ctx;
    }

    // 키워드별 사진 검색하기
    @HttpCode(200)
    @Get("/keywords/:keyword")
    async getListByKeywords(@Param('keyword') keyword: string, @QueryParams() query: GetPagnation, @Res() { ctx }: Response) {
       
        if (!keyword) {
            throw new BadRequestError('잘못된 요청입니다.');
        }

        const pictures = await this.pictureRepo.getListByKeywords(keyword,query);

        if (pictures.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: pictures
        }

        return ctx;
    }

    // 가격순으로 사진보기 
    @HttpCode(200)
    @Get("/price")
    async viewByPrice(@QueryParams() query: GetPagnation, @Res() { ctx }: Response) {

        const pictures = await this.pictureRepo.viewByPrice(query);

        if (pictures.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: pictures
        }

        return ctx;
    }


}