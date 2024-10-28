import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { Major } from "./levels.model";



@DSchema()
export class ExamRecord extends AbstractSchema {
    @Prop({ type: Schema.Types.ObjectId, ref: Major.name })
    major?: Major

    @Prop()
    type?: 'Résidanat' | 'Résidanat blanc'

    @Prop({ default: [] })
    years: number[]


}




