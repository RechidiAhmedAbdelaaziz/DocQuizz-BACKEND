import { Types } from "mongoose";
import { UserRoles } from "./user.roles";

export type JwtPayload = {
    id: Types.ObjectId,
    role: UserRoles,
    isPro: boolean
}