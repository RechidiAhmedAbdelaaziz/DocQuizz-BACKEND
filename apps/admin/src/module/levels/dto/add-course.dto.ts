import { IsBoolean, IsString } from "class-validator"

export class NameBody {
    @IsString()
    name: string
}

export class NameBodyWithIsOpen extends NameBody {
    @IsBoolean()
    isOpen: boolean
}