import { IsStrongPassword } from "class-validator";

export class UpdatePasswordBody {
    @IsStrongPassword({}, { message: 'Old password is not correct' })
    oldPassword: string;

    @IsStrongPassword()
    newPassword: string;
}