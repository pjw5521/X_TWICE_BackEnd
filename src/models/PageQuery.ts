import { IsNumber, IsOptional } from "class-validator";

export class GetPagnation{

    @IsOptional()
    @IsNumber()
    first?: number = 0;

    @IsOptional()
    @IsNumber()
    last?: number = 25;

}

