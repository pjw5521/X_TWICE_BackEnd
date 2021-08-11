import { Curl, curly } from "node-libcurl"
import { Get, HttpCode, JsonController, Param, Post, Res, UploadedFile } from "routing-controllers"
import { Response } from "koa";
import { HttpStatus } from "../types/http";

@JsonController("/vgg16")
export class Vgg16Controller{
    
    @HttpCode(HttpStatus.success)
    @Post()
    async uploadFile(@UploadedFile("file") file: any,@Res() { ctx }: Response){

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
        
        curl.on('end', close);
        curl.on('error', close);

        ctx.body = {
            data: data
        }

        return ctx;
    }

}
