import { Curl } from "node-libcurl"
import { JsonController } from "routing-controllers"

@JsonController("/vgg16")
export class Vgg16Controller{
    
    async test(){

        const curl = new Curl();

        const close = curl.close.bind(curl);

        const photo_url = "https://firebasestorage.googleapis.com/v0/b/x-twice-2021.appspot.com/o/images%2Fimg1628241239744.jpg?alt=media&token=45638d12-eeb5-4370-85e9-ee33239b2abf"
        const test_url = "http://127.0.0.1:8080/predictions/densenet161"
        
        curl.setOpt(Curl.option.URL, test_url);
        curl.setOpt(Curl.option.HTTPPOST, [
            { name: 'test_input', file: photo_url }
        ]);
        
        curl.on('end', close);
        curl.on('error', close);
    }

}