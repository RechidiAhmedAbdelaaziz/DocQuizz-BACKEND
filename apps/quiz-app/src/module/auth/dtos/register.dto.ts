import { IsName } from "@app/common"
import {  IsEmail, IsStrongPassword, MinLength } from "class-validator"


export class RegisterBody {
    @IsName()
    @MinLength(3)
    name: string

    @IsEmail()
    email: string

    @IsStrongPassword()
    password: string

}   