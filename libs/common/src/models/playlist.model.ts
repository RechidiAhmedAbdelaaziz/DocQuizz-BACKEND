import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Question } from "./question.model";
import { Schema } from "mongoose";
import { User } from "./user.model";



@DSchema()
export class Playlist extends AbstractSchema {

    @Prop()
    title: string

    @Prop({ default: 0 })
    totalQuestions: number

    @Prop([{ type: Schema.Types.ObjectId, ref: Question.name, select: false, default: [] }])
    questions: Question[]

    @Prop({ type: Schema.Types.ObjectId, ref: User.name, select: false , index: true })
    user: User

}




