import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { Major } from "./levels.model";
import { Domain } from "domain";



@DSchema()
export class ExamRecord extends AbstractSchema {
    @Prop({ type: Schema.Types.ObjectId, ref: Major.name, unique: true })
    major?: Major

    @Prop({ type: Schema.Types.ObjectId, ref: Domain.name, unique: true })
    domain?: Domain

    @Prop()
    type?: 'Résidanat' | 'Résidanat blanc'

    @Prop({ default: [] })
    years: number[]


}




