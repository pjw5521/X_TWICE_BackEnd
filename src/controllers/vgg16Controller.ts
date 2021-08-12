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
        const test_url = "http://172.16.163.153:8081/predictions/densenet161"
    
        curl.setOpt(Curl.option.URL, test_url);
        
        curl.setOpt(Curl.option.HTTPPOST, [
            { name: 'test_input', file: 'https://firebasestorage.googleapis.com/v0/b/x-twice-2021.appspot.com/o/images%2Fimg1628675495434.jpg?alt=media&token=dea746e2-f8d6-48ed-b762-9f9a3936427a' }
        ]);

        
  /*      const { statusCode, data, headers } = await curly(test_url, {
            customRequest: 'POST',
            httpHeader: ['Content-Type: application/json'],
            postFields: JSON.stringify({ name: 'test_input', file: photo_file })
        })
    */
        
        const data =   curl.on('end', close);
        curl.on('error', close);

        ctx.body = {
            data: data
        }

        return ctx;
    }

}
