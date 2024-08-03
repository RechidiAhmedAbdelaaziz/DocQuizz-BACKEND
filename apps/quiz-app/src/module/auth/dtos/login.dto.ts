import { IsEmail, IsStrongPassword } from "class-validator"


export class LoginBody {
    @IsEmail({}, { message: 'Invalid email' })
    email: string

    @IsStrongPassword({}, { message: 'Invalid password' })
    password: string

}   