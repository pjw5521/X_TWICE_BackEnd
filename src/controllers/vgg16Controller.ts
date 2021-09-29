import { HttpCode, JsonController, Param, Post, QueryParams, Res, UploadedFile } from "routing-controllers"
import { Response } from "koa";
import { HttpStatus } from "../types/http";
import FormData from "form-data";
import fetch from "node-fetch";
import { PictureVectorInput } from "../models/PictureInput";
import { validate } from "class-validator";
import { BadRequestError, HttpError } from "../error";
import { PictureRepository } from "../repositories/PictureRepository";
import { getCustomRepository } from "typeorm";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Picture } from "../entities/Picture";
import { BadRequestResponse, SuccessReponse } from "../types/swagger";
import Jimp = require("jimp");

@JsonController("/vgg16")
export class Vgg16Controller{

    private pictureRepo: PictureRepository;
    constructor() {
        this.pictureRepo = getCustomRepository(PictureRepository);
    }

    // 유사도 검사하기 
    // 사진을 post
    @HttpCode(HttpStatus.success)
    @Post()
    @OpenAPI({
        summary: "유사도 검사하기",
        description: "사진을 전송하면 유사도 검사 결과를 리턴",
    })
    async uploadFile(@UploadedFile("file") file: any, @Res() { ctx }: Response){
        const test_url = "http://sw.uos.ac.kr:8000/predict"

        console.log(file);

        const { buffer, originalname: filename } = file

        const formData = new FormData();
        formData.append("file", buffer, {
            filename
        })

       const response = await fetch(test_url, {
            method: "POST",
            body: formData,
        })

        const data = await response.json();
        
        ctx.body = {
            data
        }

        return ctx;
    }

    @HttpCode(HttpStatus.success)
    @Post("/vector")
    @ResponseSchema(Picture, {
        statusCode: HttpStatus.success,
        isArray: true
    })
    @ResponseSchema(HttpError, {
        statusCode: HttpStatus.bad_request,
    })
    @OpenAPI({
        summary: "picture의 vector, norm 저장하기",
        description: "해당 token_id의 vector, norm 저장",
        responses: {
            ...SuccessReponse,
            ...BadRequestResponse
        }
    })
    async insertVector(@Param('token_id') token_id: string, @QueryParams() query: PictureVectorInput, @Res() { ctx }: Response ){
        const errors = await validate(query);

        if (errors.length > 0) {
            throw new BadRequestError('잘못된 요청입니다')
        }

        const isSuccess  = await this.pictureRepo.insertVector(token_id, query);

        ctx.body = {
            data: isSuccess 
        }

        return ctx;
    }


}