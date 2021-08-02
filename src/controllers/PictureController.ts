import { Response } from "koa";
import { Authorized, Body, Ctx, CurrentUser, Get, HttpCode, JsonController, Param, Params, Post, Put, QueryParams, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { BadRequestError, NotFoundError } from "../error";
import { Picture } from "../entities/Picture";
import { PictureRepository } from "../repositories/PictureRepository";
import { GetPagnation } from "../models/PageQuery";
import { PictureInsertInput, PictureSaleInput, PictureUpdateInput, ViewBycategoryQuery } from "../models/PictureInput";
import { validate } from "class-validator";
import { TokenPayload } from "../types/tokens";

@JsonController("/pictures")
export class PictureController {

    private pictureRepo: PictureRepository;
    constructor() {
        this.pictureRepo = getCustomRepository(PictureRepository);
    }

    // 사진 등록하기
    @HttpCode(200)
    @Authorized()
    @Post()
    async insert(@Body() picture: PictureInsertInput, @CurrentUser() payload: TokenPayload, @Res() { ctx }: Response) {
        const errors = await validate(picture);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        console.log(payload);

        const { user_num } = payload;
        picture.user_num = user_num;

        const isSuccess = await this.pictureRepo.insertWithOptions(picture);

        ctx.body = {
            data: isSuccess
        }

        return ctx;
    }

    // 사진 정보 수정하기
    @HttpCode(200)
    @Authorized()
    @Put()
    async update(@Body() picture: PictureUpdateInput, @CurrentUser() payload: TokenPayload, @Res() { ctx }: Response) { 
        const errors = await validate(picture);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const { user_num } = payload;
        picture.user_num = user_num;
        
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

    // 카테고리별로 사진 보기  
    @HttpCode(200)
    @Get("/category")
    async viewByCategory(@QueryParams() query:  ViewBycategoryQuery, @Res() { ctx }: Response) {
  
        const pictures = await this.pictureRepo.viewByCategory(query);
  
        if (pictures.length == 0) {
          throw new NotFoundError("요청하신 결과가 없습니다.")
        }
  
        ctx.body = {
          data: pictures
        }
  
        return ctx;
    }

    // 인기순으로 사진보기 
    @HttpCode(200)
    @Get("/popular")
    async viewByPopularity(@QueryParams() query: GetPagnation, @Res() { ctx }: Response) {

        const pictures = await this.pictureRepo.viewByPopularity(query);

        if (pictures.length == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: pictures
        }

        return ctx;
    }

    // 사진 상세 정보 보기  
    @HttpCode(200)
    @Get("/:token_id")
    async viewpicture(@Param('token_id') token_id: string, @Res() { ctx }: Response) {

        const pictures = await this.pictureRepo.viewPicture(token_id);

        ctx.body = {
            data: pictures
        }

        return ctx;
    }  

    // 조회수 증가
    @HttpCode(200)
    @Put("/count/:token_id")
    async updateCount(@Param('token_id') token_id: string, @Res() { ctx }: Response) { 
        const isSuccess  = await this.pictureRepo.updateCount(token_id);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

}