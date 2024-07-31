

import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Course } from "./course.model";
import { Schema } from "mongoose";


@DSchema()
export class AcademicField extends AbstractSchema {

    @Prop()
    year: number

    @Prop()
    semester: number

    @Prop()
    name: string

    @Prop()
    icon: string

    @Prop([{ type: Schema.Types.ObjectId, ref: Course.name }])
    courses: Course[]

    @Prop()
    quizzez: number

}



