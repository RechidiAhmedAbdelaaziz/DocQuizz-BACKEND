import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../shared";

@DSchema({ versionKey: false })
export class Updates extends AbstractSchema {

    @Prop()
    title: string

    @Prop()
    description: string

    @Prop({ type: Date, default: Date.now })
    date: Date

}

//