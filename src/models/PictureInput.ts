import { IsInt, IsString, IsOptional } from "class-validator";
import { Picture } from "../entities/Picture";
import { GetPagnation } from "./PageQuery";

export class PictureSaleInput implements Partial<Picture> {

    @IsString()
    token_id: string;

    @IsInt()
    picture_price: number;  

}

export class ViewBycategoryQuery extends GetPagnation{

    @IsOptional()
    @IsString()
    category?: string = "나무";
    
}