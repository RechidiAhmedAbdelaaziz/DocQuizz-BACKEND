


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

    @Prop()
    time: number

}



