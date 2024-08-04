import { Schema as DSchema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@DSchema()
export class AbstractSchema extends Document<Types.ObjectId> { }