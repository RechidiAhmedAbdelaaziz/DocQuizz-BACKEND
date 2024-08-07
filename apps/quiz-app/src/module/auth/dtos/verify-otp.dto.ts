import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class VerifyOtpBody {
    @IsEmail()
    email: string

    @IsString()
    @Length(6, 6)
    otp: string
}