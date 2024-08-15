import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";



@DSchema()
export class Exam extends AbstractSchema {

    @Prop()
    title: string

    @Prop()
    time: number

    @Prop()
    year: number

    @Prop({ default: 0 })
    questions: number
}



