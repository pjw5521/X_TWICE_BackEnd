import { IsInt, IsString, IsOptional, Length, IsNumber } from "class-validator";
import { History } from "../entities/History";

export class HistoryInsertInput implements Partial<History> {

    @IsNumber()
    user_num2

    @IsString()
    token_id: string;

    @IsString()
    picture_url: string;

    @IsString()
    picture_title: string;

    @IsNumber()
    picture_price: number;

    @IsString()
    picture_info: string;

    user_num: number;
    /* @IsHash("sha256")
    user_password: string; */ 

}