


import { Schema as DSchema, Prop, raw } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { AcademicField } from "./academic-field.model";
import { Schema } from "mongoose";
import { Reference } from "./reference.model";
import { Course } from "./course.model";


@DSchema()
export class Quizz extends AbstractSchema {

    @Prop()
    question: string

    @Prop()
    correctAnswers?: string[]

    @Prop()
    incorrectAnswers?: string[]

    @Prop()
    explanation?: string

    @Prop()
    difficulty:  "Easy" | "Medium" | "Hard" 

    @Prop({ type: Schema.Types.ObjectId, ref: AcademicField.name })
    field: AcademicField

    @Prop({ type: Schema.Types.ObjectId, ref: Course.name })
    course: Course

    @Prop()
    type: 'QCM' | 'QCU'

    @Prop()
    notes?: string[] 

    @Prop(raw({ ref: { type: Schema.Types.ObjectId, ref: Reference.name }, year: Number }))
    reference: {
        ref: Reference,
        year: number
    }

}



