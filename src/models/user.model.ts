import { Schema as DSchema, Prop, raw, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";


@DSchema()
export class User extends AbstractSchema {

    @Prop()
    name: string

    @Prop()
    email: string

    @Prop({ select: false })
    password: string

    @Prop()
    balnce: number

    @Prop()
    income: number

    @Prop()
    expense: number

    @Prop({ type: [raw({ name: String, icon: String, color: String })] })
    categories: { name: string, icon: string, color: string }[]
}

