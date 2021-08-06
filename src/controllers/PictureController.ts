import { Response } from "koa";
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Params, Post, Put, QueryParams, Res } from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { BadRequestError, HttpError, NotFoundError } from "../error";
import { PictureRepository } from "../repositories/PictureRepository";
import { GetPagnation } from "../models/PageQuery";
import { PictureInsertInput, PictureSaleInput, PictureUpdateInput, ViewBycategoryQuery } from "../models/PictureInput";
import { validate } from "class-validator";
import { TokenPayload } from "../types/tokens";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Picture } from "../entities/Picture";
import { HttpStatus } from "../types/http";
import { BadRequestResponse, NotFoundResponse, SuccessReponse } from "../types/swagger";

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
    @ResponseSchema(Picture, {
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
    async insert(@Body() pictureInsertInput: PictureInsertInput, @CurrentUser() payload: TokenPayload, @Res() { ctx }: Response) {
        const errors = await validate(pictureInsertInput);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        console.log(payload);

        const { user_num } = payload;
        pictureInsertInput.user_num = user_num;

        const pictureInsertResult = await this.pictureRepo.insertWithOptions(pictureInsertInput);

        const { generatedMaps, identifiers } = pictureInsertResult;
        const picture = generatedMaps?.[0] || identifiers?.[0]

        if (!picture) {
            throw new NotFoundError("처리된 회원정보를 찾지 못했습니다.");
        }

        ctx.body = {
            data: pictureInsertInput
        }

        return ctx;
    }

    // 사진 정보 수정하기
    @HttpCode(200)
    @Authorized()
    @Put()
    @ResponseSchema(Picture, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.bad_request,
    })
    @OpenAPI({
        summary: "토큰 정보 수정",
        responses: {
            ...SuccessReponse,
            ...BadRequestResponse
        },
    })
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
    @ResponseSchema(Picture, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.bad_request,
    })
    @OpenAPI({
        summary: "판매 토큰으로 등록",
        description: "해당 토큰의 state를 Y로 변경하고, price를 등록합니다.",
        responses: {
            ...SuccessReponse,
            ...BadRequestResponse
        },
    })
    async registerSale(@Body() picture: PictureSaleInput, @Res() { ctx }: Response) { 
        const errors = await validate(picture);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const isSuccess  = await this.pictureRepo.registerSale(picture);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

    // 판매 취소(보유 중인 상태로 변경) 
    @HttpCode(200)
    @Put("/cancle/:token_id")
    @ResponseSchema(Picture, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @OpenAPI({
        summary: "토큰 판매 취소",
        description: "해당 토큰의 state를 N으로 변경합니다.",
        responses: {
            ...SuccessReponse,
        
        },
    })
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
    @ResponseSchema(Picture, {
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
        summary: "사진 검색",
        description: "입력한 키워드에 해당하는 사진들을 조회합니다. 불러올 페이지의 처음과 마지막 값이 필요합니다.",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse,
            ...BadRequestResponse
        },
    })
    async getListByKeywords(@Param('keyword') keyword: string, @QueryParams() query: GetPagnation, @Res() { ctx }: Response) {
       
        if (!keyword) {
            throw new BadRequestError('잘못된 요청입니다.');
        }

        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
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
    @ResponseSchema(Picture, {
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
        summary: "가격 순으로 사진 조회",
        description: "price가 높은 순으로 사진들을 조회합니다.",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse,
            ...BadRequestResponse
        },
    })
    async viewByPrice(@QueryParams() query: GetPagnation, @Res() { ctx }: Response) {
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

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
    @ResponseSchema(Picture, {
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
        summary: "카테고리 별로 사진 조회",
        description: "선택한 카테고리 별로 사진들을 조회합니다.",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse,
            ...BadRequestResponse
        },
    })
    async viewByCategory(@QueryParams() query:  ViewBycategoryQuery, @Res() { ctx }: Response) {
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

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
    @ResponseSchema(Picture, {
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
        summary: "인기 순으로 사진 조회",
        description: "count(조회수)가 높은 순으로 사진을 조회합니다.",
        responses: {
            ...SuccessReponse,
            ...NotFoundResponse,
            ...BadRequestResponse
        },
    })
    async viewByPopularity(@QueryParams() query: GetPagnation, @Res() { ctx }: Response) {
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }
        
        const result = await this.pictureRepo.viewByPopularity(query);

        
        const pictures = result[0];
        const count = result[1];
        
        if (pictures.length == 0 || count == 0) {
            throw new NotFoundError("요청하신 결과가 없습니다.")
        }

        ctx.body = {
            data: {
                items: pictures,
                count
            }
        }

        return ctx;
    }

    // 사진 상세 정보 보기  
    @HttpCode(200)
    @Get("/:token_id")
    @ResponseSchema(Picture, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @OpenAPI({
        summary: "사진 상세 정보 조회",
        description: "선택한 사진의 상세 정보를 조회합니다.",
        responses: {
            ...SuccessReponse,
        },
    })
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
    @ResponseSchema(Picture, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @OpenAPI({
        summary: "조회수 증가",
        description: "선택한 사진의 조회수를 1 증가 시킵니다.",
        responses: {
            ...SuccessReponse,
        },
    })
    async updateCount(@Param('token_id') token_id: string, @Res() { ctx }: Response) { 
        const isSuccess  = await this.pictureRepo.updateCount(token_id);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }

}