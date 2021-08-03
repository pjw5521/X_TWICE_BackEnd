import { IsHash, IsInt, IsString, Length, ValidateIf } from "class-validator";
import { User } from "../entities/User";

export class UserInsertInput implements Partial<User> {

    /* @IsInt()
    user_num: number;

    ;  */

    @IsString()
    @Length(5, 20, { each: true })
    user_id: string; 

    @IsString()
    @Length(5, 255, { each: true })
    user_account: string;

    /* @IsHash("sha256")
    user_password: string; */ 

}

export class UserUpdateInput implements Partial<User> {

    @IsInt()
    user_num: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @Length(5, 64, { each: true })
    user_id?: string;

}

export class UserLoginInput implements Partial<User> {

    @IsString()
    @Length(5, 20, { each: true })
    user_id: string; 

    //@IsHash("sha256")
    @IsString()
    user_password: string; 

}