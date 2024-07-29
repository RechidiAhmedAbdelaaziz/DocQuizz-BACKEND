import { Schema } from "mongoose";

export type JwtPayload = { id: Schema.Types.ObjectId, email: string }