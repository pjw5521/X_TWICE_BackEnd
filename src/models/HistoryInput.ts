import { IsInt, IsString, IsOptional, Length, IsNumber } from "class-validator";
import { History } from "../entities/History";

export class HistoryInsertInput implements Partial<History> {

    @IsNumber()
    user_num1:number;

    @IsString()
    picture_url: string;

    @IsString()
    picture_title: string;

    @IsString()
    token_id: string;

    @IsNumber()
    picture_price: number;

    user_num2: number;
    
}