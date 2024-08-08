import { IsString } from "class-validator";

export class CreatePalyListBody {
    @IsString()
    title: string
}