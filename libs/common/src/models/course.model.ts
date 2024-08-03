


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { AcademicField } from "./academic-field.model";
import { Schema } from "mongoose";



@DSchema()
export class Course extends AbstractSchema {


    @Prop()
    title: string

    @Prop({ default: 0 })
    quizzez: number

    @Prop({ type: Schema.ObjectId, ref: AcademicField.name , select: false})
    academicField: AcademicField

}



