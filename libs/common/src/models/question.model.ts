


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { Exam } from "./exam.model";
import { Course } from "./levels.model";
import { Source } from "./source.model";



@DSchema({ timestamps: true })
export class Question extends AbstractSchema {

    @Prop()
    questionText: string

    @Prop()
    answers: {
        text: string,
        isCorrect: boolean,
    }[]

    @Prop()
    difficulty: "easy" | "medium" | "hard"

    @Prop()
    type: "QCM" | "QCU" 

    @Prop({ type: Schema.Types.ObjectId, ref: Exam.name })
    exam?: Exam

    @Prop({ type: Schema.Types.ObjectId, ref: Course.name })
    course: Course

    @Prop()
    explanation?: string

    @Prop({ type: Schema.Types.ObjectId, ref: Source.name })
    source: Source

    @Prop()
    year: number
}




