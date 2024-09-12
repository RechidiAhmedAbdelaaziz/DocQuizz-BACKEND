


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { Exam } from "./exam.model";



@DSchema({ timestamps: true })
export class Question extends AbstractSchema {

    @Prop()
    questionText: string

    @Prop()
    correctAnswers: string[]

    @Prop()
    wrongAnswers: string[]

    @Prop()
    difficulty: "easy" | "medium" | "hard"

    @Prop()
    type: "QCM" | "QCU"

    @Prop({ type: Schema.Types.ObjectId, ref: Exam.name })
    exam?: Exam

    @Prop({
        type: {
            level: String,
            major: String,
            course: String
        },
        _id: false
    })
    field: {
        level: string

        major: string

        course: string
    }

    @Prop()
    explanation?: string


    @Prop()
    source: string

    @Prop()
    year : number
}




