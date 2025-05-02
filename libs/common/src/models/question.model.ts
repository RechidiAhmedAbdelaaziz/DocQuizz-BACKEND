


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { Exam } from "./exam.model";
import { Course } from "./levels.model";
import { Source } from "./source.model";
import { Difficulty, QuestionType } from "../shared";



@DSchema({ timestamps: true, })
export class Question extends AbstractSchema {

    @Prop()
    caseText?: string

    @Prop()
    questions: {
        text: string,
        answers: {
            text: string,
            images?: string[],
            isCorrect: boolean,
        }[],
        difficulty: Difficulty,
        type?: QuestionType,
        explanation?: {
            text: string,
            images?: string[],
        },
        images?: string[],
    }[]

    @Prop()
    images?: string[]

    @Prop()
    type: QuestionType;

    @Prop([{ type: Schema.Types.ObjectId, ref: Exam.name, default: [] }])
    exams?: Exam[]

    @Prop({ type: Schema.Types.ObjectId, ref: Course.name , index: true })
    course: Course

    @Prop({
        type: [{
            source: { type: Schema.Types.ObjectId, ref: Source.name },
            year: { type: Number, default: 0 }
        }],
        _id: false
    })
    sources: {
        source: Source,
        year: number
    }[]


    @Prop()
    withExplanation: boolean

    @Prop()
    difficulties: Difficulty[]

    @Prop()
    sortField: string

}



// {"caseText":"string","questions":[{"text":"string","answers":[{"text":"string","isCorrect":true}],"difficulty":"EASY","type":"MCQ","explanation":"string"}],"type":"MCQ","exam":"5f9b1b3b1f4b1b001f1b1f4b","course":"5f9b1b3b1f4b1b001f1b1f4a","source":"5f9b1b3b1f4b1b001f1b1f4a","year":2020,"withExplanation":true,"difficulties":["EASY","MEDIUM","HARD"]}
