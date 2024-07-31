


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";


@DSchema()
export class Reference extends AbstractSchema {

    @Prop()
    name: string

    @Prop()
    years : number[]
}



