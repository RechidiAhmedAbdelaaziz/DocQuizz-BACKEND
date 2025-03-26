import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../shared";
import { Schema } from "mongoose";
import { User } from "./user.model";
import { Level } from "./levels.model";

@DSchema()
export class Subscription extends AbstractSchema {
    @Prop()
    type: string

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop({ type: [Schema.Types.ObjectId], ref: Level.name })
    levels: Level[]


    @Prop({ type: Date, index: { expireAfterSeconds: 2 } })
    endDate: Date
}


@DSchema()
export class SubscriptionRequest extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop({ type: [Schema.Types.ObjectId], ref: Level.name })
    levels: Level[]

    @Prop()
    image: string
}