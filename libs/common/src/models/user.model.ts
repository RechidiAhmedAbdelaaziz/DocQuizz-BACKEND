import { Schema as DSchema, Prop, raw } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { JwtPayload, UserRoles } from "../shared";
import { Level, Major, Domain } from "./levels.model";
import { Schema, Types } from "mongoose";


@DSchema()
export class User extends AbstractSchema {

    @Prop({ default: UserRoles.USER })
    role: UserRoles;

    @Prop({ default: false })
    isPro: boolean;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop({ select: false })
    password: string;

    @Prop({ type: Schema.Types.ObjectId, ref: Domain.name })
    domain?: Domain

    @Prop({ type: Schema.Types.ObjectId, ref: Level.name })
    level: Level


    @Prop({ default: 0 })
    quizez: number;

    @Prop({ default: 0 })
    playlists: number;

    @Prop({ default: [], type: [Schema.Types.ObjectId], ref: Level.name })
    paidLevels: Level[];



    toJwtPayload(): JwtPayload {
        return {
            id: this._id,
            role: this.role,
            isPro: this.isPro,
            paidLevels: this.paidLevels ? this.paidLevels.map((level) => level._id) : undefined,
            domain: this.domain ? this.domain._id : undefined
        }
    }



}


