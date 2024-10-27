import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { Major } from "./levels.model";



@DSchema()
export class Exam extends AbstractSchema {
    @Prop()
    title: string

    @Prop({ default: 0 })
    questions: number

    @Prop({ type: Schema.Types.ObjectId, ref: Major.name, select: false })
    major: Major

    @Prop()
    type: string

    @Prop()
    time: number

    @Prop()
    year: number

    @Prop()
    city: string

    @Prop()
    group: string






}



