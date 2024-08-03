import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { UserRoles } from "../shared";


@DSchema()
export class User extends AbstractSchema {

    @Prop()
    name: string

    @Prop()
    email: string

    @Prop({ select: false })
    password: string

    @Prop({ default: UserRoles.user })
    role: UserRoles

    @Prop({ default: false })
    isPro: boolean

    @Prop({ default: 0 })
    exams: number
}

