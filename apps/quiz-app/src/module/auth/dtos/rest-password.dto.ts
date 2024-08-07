import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class RestPasswordBody {
    @IsEmail({}, { message: 'Invalid email' })
    email: string

    @IsString()
    otp: string

    @IsStrongPassword({}, { message: 'Invalid password' })
    password: string
}