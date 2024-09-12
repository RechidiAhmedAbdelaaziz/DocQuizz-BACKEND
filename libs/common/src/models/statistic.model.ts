


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../shared";

@DSchema()
export class Statistic extends AbstractSchema {

    @Prop({ type: Number, default: 0 })
    totalExam: number

    @Prop({ type: Number, default: 0 })
    totalQuestion: number

    @Prop({ type: Number, default: 0 })
    totalUser: number

    @Prop({ type: Number, default: 0 })
    totalSubscribedUser: number

    @Prop({ type: Number, default: 0 })
    totalMajor: number

    @Prop({ type: Number, default: 0 })
    totalDomain: number

}