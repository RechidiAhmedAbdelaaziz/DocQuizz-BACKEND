import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { Domain, Major } from "./levels.model";



@DSchema()
export class Exam extends AbstractSchema {
    @Prop()
    title: string

    @Prop({ default: 0 })
    questions: number

    @Prop({ type: Schema.Types.ObjectId, ref: Major.name , index  : true})
    major: Major

    @Prop({ type: Schema.Types.ObjectId, ref: Domain.name , index  : true})
    domain: Domain


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

    @Prop({ default: false })
    isOpen: boolean

}




