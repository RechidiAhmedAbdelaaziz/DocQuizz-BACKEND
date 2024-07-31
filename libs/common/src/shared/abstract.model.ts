import { Schema as DSchema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@DSchema({
    timestamps: true
})
export class AbstractSchema extends Document<Types.ObjectId> { }