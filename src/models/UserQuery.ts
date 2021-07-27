import { IsBoolean, IsOptional, IsString } from "class-validator";

export class GetPicturesQuery {

    @IsOptional()
    @IsString()
    state?: string = "N";
}