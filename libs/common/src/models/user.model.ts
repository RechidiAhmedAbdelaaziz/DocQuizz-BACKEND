import { Schema as DSchema, Prop, raw } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { UserRoles } from "../shared";
import { Level, Major , Domain } from "./levels.model";
import { Schema } from "mongoose";


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



}


