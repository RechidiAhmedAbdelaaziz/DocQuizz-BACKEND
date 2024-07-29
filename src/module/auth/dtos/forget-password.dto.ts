import { IsEmail } from "class-validator";

export class ForgetPasswordBody {
    @IsEmail({}, { message: 'Invalid email' })
    email: string
}