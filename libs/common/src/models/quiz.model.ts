import { Schema as DSchema, Prop, raw } from "@nestjs/mongoose";
import { Question } from "./question.model";
import { Schema } from "mongoose";
import { AbstractSchema } from "../shared";
import { User } from "./user.model";


@DSchema(
    { timestamps: true }
)
export class Quiz extends AbstractSchema {

    @Prop()
    title: string

    @Prop({ default: 0 })
    totalQuestions: number

    @Prop({ type: Schema.Types.ObjectId, ref: User.name, select: false , index: true })
    user: User

    @Prop({
        type: raw({ time: Number, answered: Number, correct: Number, correctTime: Number }),
        default: { time: 0, answered: 0, correct: 0, correctTime: 0 },
        _id: false
    })
    result: {
        time: number
        answered: number
        correct: number
        correctTime: number
    }

    @Prop({ default: false })
    isCompleted: boolean

    @Prop({
        type: [raw({
            question: { type: Schema.Types.ObjectId, ref: Question.name },
            result: raw({
                time: Number, choices: [[Number]], isCorrect: [Boolean],
                isAnswerd: { type: Boolean, default: false }
            }),
        })],
        select: false,
        _id: false
    })
    questions: {
        question: Question,
        result: {
            time: number,
            choices: number[][],
            isCorrect: boolean[],
            isAnswerd: boolean
        }
    }[]

    @Prop({ default: [] })
    coerrectIndexes: number[]

    @Prop({
        type: [{
            questionIndex: Number,
            subQuestionIndexes: [Number]
        }],
        _id: false,
        default: []
    })
    wrongIndexes: {
        questionIndex: number,
        subQuestionIndexes: number[]
    }[]


    // last quiestion has been answered index
    @Prop({ default: 0 })
    lastAnsweredIndex: number


}

// {"case"}


