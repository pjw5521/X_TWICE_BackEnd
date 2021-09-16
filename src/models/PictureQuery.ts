import { IsOptional, IsString } from "class-validator";
import { GetPagnation } from "./PageQuery";

export class GetMyListQuery extends GetPagnation{

    @IsOptional()
    @IsString()
    state?: string = "N";
    
}

