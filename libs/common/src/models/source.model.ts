import { Prop, Schema } from "@nestjs/mongoose";
import { AbstractSchema } from "../shared";


@Schema()
export class Source extends AbstractSchema {

    @Prop()
    title: string
}