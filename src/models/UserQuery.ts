import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class GetPicturesQuery {

    @IsOptional()
    @IsString()
    state?: string = "N";
}

export class GetMyListQuery {

    @IsOptional()
    @IsString()
    state?: string = "N";

    @IsOptional()
    @IsNumber()
    first?: number = 0;

    @IsOptional()
    @IsNumber()
    last?: number = 25;
    
}

export class GetPagnation {

    @IsOptional()
    @IsNumber()
    first?: number = 0;

    @IsOptional()
    @IsNumber()
    last?: number = 25;

}