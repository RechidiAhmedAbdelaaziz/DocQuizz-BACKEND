import { Schema as DSchema } from "@nestjs/mongoose";
import { Document, Schema } from "mongoose";


@DSchema({
    timestamps: true
})
export class AbstractSchema extends Document<Schema.Types.ObjectId> { }