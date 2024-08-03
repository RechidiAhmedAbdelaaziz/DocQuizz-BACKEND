


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { User } from "./user.model";
import { Quizz } from "./quizz.model";
import { AcademicField } from "./academic-field.model";


@DSchema()
export class Exam extends AbstractSchema {


    @Prop()
    title: string

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop([{ type: Schema.Types.ObjectId, ref: Quizz.name }])
    questions: Quizz[]

    @Prop({default: 0})
    answers: number

    @Prop({default: 0})
    correctAnswers: number

    @Prop([{ type: Schema.Types.ObjectId, ref: Quizz.name }])
    incorrectAnswers: Quizz[]




}



