import { Prop, Schema as DSchema } from "@nestjs/mongoose";
import { AbstractSchema } from "../shared";
import { Schema } from "mongoose";
import { Quiz } from "./quiz.model";
import { User } from "./user.model";

@DSchema()
export class QuizRecord extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: Quiz.name })
    quiz: Quiz

    @Prop({ type: Schema.Types.ObjectId, ref: User.name, select: false })
    user: User

    @Prop({ index: { expireAfterSeconds: 1 }, select: false })
    expirationDate: Date
}