import { IsInt, IsString, IsOptional, Length, IsNumber } from "class-validator";
import { Picture } from "../entities/Picture";
import { GetPagnation } from "./PageQuery";

export class PictureInsertInput implements Partial<Picture> {

    @IsString()
    token_id: string;

    @IsString()
    picture_url: string;

    @IsString()
    picture_directory: string;

    @IsString()
    picture_name: string;

    @IsString()
    picture_title: string;

    @IsString()
    picture_category: string;

    @IsString()
    picture_info: string;

    @IsString()
    picture_vector: string;

    @IsNumber()
    picture_norm: number;

    user_num: number; 

}

export class PictureUpdateInput implements Partial<Picture> {
   
    @IsString()
    //@Length(5, 255)
    token_id?: string;

    @IsOptional()
    @IsString()
    picture_url?: string;

    @IsOptional()
    @IsString()
    picture_directory?: string;

    @IsOptional()
    @IsString()
    picture_name?: string;

    @IsOptional()
    @IsString()
    @Length(5, 20)
    picture_title?: string;

    @IsOptional()
    @IsString()
    @Length(5, 20)
    picture_category?: string;

    @IsOptional()
    @IsString()
    @Length(5, 200)
    picture_info?: string;

    @IsOptional()
    @IsInt()
    user_num?: number;

}

export class PictureSaleInput implements Partial<Picture> {

    @IsString()
    token_id: string;

    @IsNumber()
    picture_price: number;  

}

export class ViewBycategoryQuery extends GetPagnation {

    @IsOptional()
    @IsString()
    category?: string = "test";
    
}

export class PictureVectorInput{

    @IsString()
    picture_vector: string;

    @IsNumber()
    picture_norm: number;
    
}

function IsPositiveFloat() {
    throw new Error("Function not implemented.");
}
