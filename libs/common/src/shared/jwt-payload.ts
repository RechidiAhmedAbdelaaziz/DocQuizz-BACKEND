import { Types } from "mongoose";
import { UserRoles } from "./enums";
import { User } from "../models";

export class JwtPayload {
    id: Types.ObjectId;
    role: UserRoles;
    isPro: boolean;
    domain?: Types.ObjectId;
    paidLevels?: Types.ObjectId[]

    constructor(user: User) {
        this.id = user._id;
        this.role = user.role;
        this.isPro = user.isPro;
        this.domain = user.domain ? user.domain._id : undefined;
        this.paidLevels = user.paidLevels ? user.paidLevels.map((level) => level._id) : undefined;
    }

    toPlainObject() {
        return {
            id: this.id,
            role: this.role,
            isPro: this.isPro,
            domain: this.domain,
            paidLevels: this.paidLevels
        }
    }


}

