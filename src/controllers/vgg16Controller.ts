import { HttpCode, JsonController, Param, Post, QueryParams, Res, UploadedFile } from "routing-controllers"
import { Response } from "koa";
import { HttpStatus } from "../types/http";
import FormData from "form-data";
import fetch from "node-fetch";
import { PictureVectorInput } from "../models/PictureInput";
import { validate } from "class-validator";
import { BadRequestError } from "../error";
import { PictureRepository } from "../repositories/PictureRepository";
import { getCustomRepository } from "typeorm";

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
    async uploadFile(@UploadedFile("file") file: any, @Res() { ctx }: Response){
        const test_url = "http://172.16.163.153:8000/predict"

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

    // vector, norm 값 저장하기
    // 유사도 검사 결과, vector, norm 값을 받음. vector와 norm db에 저장하기 
    // 근데 token_id를 어떻게 받지 ????????????????????
    @HttpCode(HttpStatus.success)
    @Post("/vector")
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