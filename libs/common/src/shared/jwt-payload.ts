import { Types } from "mongoose";
import { UserRoles } from "./enums";

export type JwtPayload = {
    id: Types.ObjectId,
    role: UserRoles,
    isPro: boolean,
    domain?: Types.ObjectId,
}