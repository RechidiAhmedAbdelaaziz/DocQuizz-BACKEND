import { IsString } from "class-validator";

export class CreateOrUpdateUpdateDto {

    @IsString()
    title: string;

    @IsString()
    description: string;
}