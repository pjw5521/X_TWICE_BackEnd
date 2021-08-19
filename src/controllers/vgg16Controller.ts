import { HttpCode, JsonController, Post, Res, UploadedFile } from "routing-controllers"
import { Response } from "koa";
import { HttpStatus } from "../types/http";
import FormData from "form-data";
import fetch from "node-fetch";

@JsonController("/vgg16")
export class Vgg16Controller{
    
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

}
