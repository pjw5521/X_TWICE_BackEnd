import { Curl, curly } from "node-libcurl"
import { Get, HttpCode, JsonController, Param, Post, Res, UploadedFile } from "routing-controllers"
import { Response } from "koa";
import { HttpStatus } from "../types/http";
import axios, {} from "axios"
import FormData from "form-data";
import fs from "fs"

@JsonController("/vgg16")
export class Vgg16Controller{
    
    @HttpCode(HttpStatus.success)
    @Post()
    async uploadFile(@UploadedFile("file") file: any,@Res() { ctx }: Response){

        const curl = new Curl();

        const close = curl.close.bind(curl);

       // const photo_file = file as File
        const photo_file = "./kitten_small.jpg"
        const test_url = "http://172.16.163.153:8081/predictions/densenet161"
        const file_url = "https://firebasestorage.googleapis.com/v0/b/x-twice-2021.appspot.com/o/images%2Fimg1628675495434.jpg?alt=media&token=dea746e2-f8d6-48ed-b762-9f9a3936427a"
    
        const stream = fs.createWriteStream(photo_file)
        //curl.setOpt(Curl.option.URL, test_url);
        
        /* curl.setOpt(Curl.option.HTTPPOST, [
            { name: 'test_input', file: 'https://firebasestorage.googleapis.com/v0/b/x-twice-2021.appspot.com/o/images%2Fimg1628675495434.jpg?alt=media&token=dea746e2-f8d6-48ed-b762-9f9a3936427a' }
        ]); */

        
        /*  const { statusCode, data, headers } = await curly(test_url, {
            customRequest: 'POST',
            httpHeader: ['Content-Type: application/json'],
            postFields: JSON.stringify({ name: 'test_input', file: photo_file })
        }) */
        
        /* const data = curl.on('end', close);
        curl.on('error', close); 

        const data = await this.uploadImage(test_url, "kitten_small.jpg");
        console.log(data);
        */

        console.log(file);

        const formData = new FormData();
        // formData.append('files', FileReader.readAsDataURL(file as File));
        formData.append('file', file)

        const data = await axios.post(test_url, formData, {
            headers :{
                'Content-Type' : 'multipart/form-data'
            }
        })
        

        ctx.body = {
            data: data
        }

        return ctx;
    }


    
    private uploadImage = (test_url: string, file: any) => new Promise((resolve, reject) => {
        const curl = new Curl();
        const close = curl.close.bind(curl);

        curl.setOpt(Curl.option.URL, test_url);
    
        curl.setOpt(Curl.option.PUT, file);

        curl.on("end", (statusCode, data, headers) => {
            close();
            console.log(statusCode);
            console.log(data);
            console.log(headers);
            resolve(data)
        })
        curl.on("error", (error) => {
            close();
            console.log(error);
            reject(error);
        })

        curl.perform();
    });

    private fileToBlob = async (file) => new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type })

}
