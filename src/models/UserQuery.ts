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
    first?: number;

    @IsOptional()
    @IsNumber()
    last?: number;
    
}

export class GetListByKeywordsQuery{

    @IsOptional()
    @IsNumber()
    first?: number;

    @IsOptional()
    @IsNumber()
    last?: number;

}