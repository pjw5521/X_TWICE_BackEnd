import { IsIn, IsInt, IsString, Length, ValidateIf } from "class-validator";
import { Picture } from "../entities/Picture";

export class PictureSaleInput implements Partial<Picture> {

    @IsString()
    token_id: string;

    @IsInt()
    picture_price: number;  

}