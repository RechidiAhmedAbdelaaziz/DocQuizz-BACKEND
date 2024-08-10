import { Schema as DSchema, Prop, raw } from "@nestjs/mongoose";
import { Question } from "./question.model";
import { Schema } from "mongoose";
import { AbstractSchema } from "../shared";
import { User } from "./user.model";



class Result {
    time: number
    answered: number
    correct: number
}

class QuestionStatus {
    question: Question
    isCorrect?: boolean
}

@DSchema()
export class Quiz extends AbstractSchema {

    @Prop()
    title: string

    @Prop({ default: 0 })
    totalQuestions: number

    @Prop({ type: Schema.Types.ObjectId, ref: User.name, select: false })
    user: User

    @Prop({ default: { time: 0, answered: 0, correct: 0 } })
    result: Result

    @Prop({ default: false })
    isCompleted: boolean

    @Prop({
        type: [raw({ question: { type: Schema.Types.ObjectId, ref: Question.name }, isCorrect: Boolean })],
        default: [],
        select: false,
        _id: false
    })
    questions: QuestionStatus[]

}




