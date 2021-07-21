import { IsInt, IsOptional, IsString, Length } from "class-validator";
import { User } from "../entities/User";

export class UserInsertInput implements Partial<User> {

    @IsInt()
    user_num: number;

    @IsString()
    @Length(5, 64)
    user_account: string;  

}

export class UserUpdateInput implements Partial<User> {

    @IsInt()
    user_num: number;

    @IsOptional()
    @IsString()
    @Length(5, 64)
    user_account?: string;  

}