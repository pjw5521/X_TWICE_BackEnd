import { Curl, curly } from "node-libcurl"
<<<<<<< HEAD
import { Get, HttpCode, JsonController, Param, Post, Res, UploadedFile } from "routing-controllers"
import { Response } from "koa";
import { HttpStatus } from "../types/http";
=======
import {  Get, HttpCode, JsonController, Res } from "routing-controllers"
import { HttpStatus } from "../types/http";
import { Response } from "koa";
>>>>>>> 04b99e4941f5b4672128682742f6a9bd8bc1e8aa

@JsonController("/vgg16")
export class Vgg16Controller{
    
    @HttpCode(HttpStatus.success)
<<<<<<< HEAD
    @Post()
    async uploadFile(@UploadedFile("file") file: any,@Res() { ctx }: Response){
=======
    @Get()
    async test(@Res() { ctx }: Response){
>>>>>>> 04b99e4941f5b4672128682742f6a9bd8bc1e8aa

        const curl = new Curl();

        const close = curl.close.bind(curl);

        const photo_file = file
        const test_url = "http://172.16.163.153:8080/predictions/densenet161"
    
        curl.setOpt(Curl.option.URL, test_url);
        
        const { statusCode, data, headers } = await curly(test_url, {
            customRequest: 'POST',
            httpHeader: ['Content-Type: application/json'],
            postFields: JSON.stringify({ name: 'test_input', file: photo_file })
        })
        
       // const result = await curl.on('end', close);

        const { statusCode, data, headers } = await curly(test_url, {
            customRequest: 'POST',
            httpHeader: ['Content-Type: application/json'],
            postFields: JSON.stringify({ name: 'test_input', file: photo_url })
        })

        curl.on('error', close);

        ctx.body = {
            data: data
        }

        return ctx;
    }

}
