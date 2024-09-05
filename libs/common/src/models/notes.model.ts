import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { User } from "./user.model";
import { Schema, Types } from "mongoose";
import { Question } from "./question.model";



@DSchema()
export class Note extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name, select: false })
    user: User

    @Prop({ type: Schema.Types.ObjectId, ref: Question.name })
    question: Question

    @Prop({
        type: [{ note: String, imgUrl: String, index: Number }],
        _id: false
    })
    notes: {
        note: string
        imgUrl?: string
        index: number
    }[]

}






