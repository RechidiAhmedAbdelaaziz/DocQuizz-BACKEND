import { Schema as DSchema, Prop, raw } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { UserRoles } from "../shared";
import { Major } from "./levels.model";
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

    @Prop(
        raw({ domain: String, level: String, faculty: String }))
    speciality: {
        domain: string;
        level: string;
        faculty: string;
    }

    @Prop({ default: 0 })
    quizez: number;

    @Prop({ default: 0 })
    playlists: number;



}


