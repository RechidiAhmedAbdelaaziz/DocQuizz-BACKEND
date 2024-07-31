


import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";



@DSchema()
export class Course extends AbstractSchema {


    @Prop()
    title: string

    @Prop({default: 0})
    quizzez: number

}



