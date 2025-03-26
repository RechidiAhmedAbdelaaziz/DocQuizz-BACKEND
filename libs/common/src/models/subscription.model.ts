import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../shared";
import { Schema, Types } from "mongoose";
import { User } from "./user.model";
import { Level, Domain } from "./levels.model";

@DSchema()
export class SubscriptionOffer extends AbstractSchema {
    @Prop()
    title: string

    @Prop({ type: Schema.Types.ObjectId, ref: Domain.name })
    domain: Domain | Types.ObjectId

    @Prop({ type: [Schema.Types.ObjectId], ref: Level.name })
    levels: (Level | Types.ObjectId)[]

    @Prop()
    description: string

    @Prop()
    price: number

}

@DSchema()
export class Subscription extends AbstractSchema {
    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop({ type: Date, index: { expireAfterSeconds: 2 } })
    endDate: Date

    @Prop({ type: Schema.Types.ObjectId, ref: SubscriptionOffer.name })
    offer: SubscriptionOffer
}

@DSchema()
export class SubscriptionRequest extends AbstractSchema {
    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop({ type: [Schema.Types.ObjectId], ref: SubscriptionOffer.name })
    offer: SubscriptionOffer

    @Prop()
    proof: string
}


