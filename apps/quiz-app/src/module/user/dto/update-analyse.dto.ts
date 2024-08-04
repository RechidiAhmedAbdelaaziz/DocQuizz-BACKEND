import { IsBoolean, IsString } from "class-validator";

export class UpdateAnalyseBody{
    @IsString()
    major: string;

    @IsBoolean()
    isCorrectAnswers: boolean;
}