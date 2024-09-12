import { IsString } from "class-validator"

export class NameBody {
    @IsString()
    name: string
}