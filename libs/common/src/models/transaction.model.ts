import { Schema as DSchema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { User } from "./user.model";


@DSchema()
export class Transaction extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop()
    amount: number

    @Prop()
    category: string

    @Prop()
    note: string

    @Prop()
    date: Date
}

