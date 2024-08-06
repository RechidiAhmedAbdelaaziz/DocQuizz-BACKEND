


import { Schema as DSchema, Prop, raw } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";
import { User } from "./user.model";
import { Exam } from "./exam.model";


@DSchema({ timestamps: true })
export class ExamResult extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name, select: false })
    user: User

    @Prop({ type: Schema.Types.ObjectId, ref: Exam.name })
    exam: Exam

    @Prop({
        type: raw({
            answerd: Number,
            correct: Number,
        }),
        default: { answerd: 0, correct: 0 }
    })
    result: {
        answerd: number,
        correct: number,
    }
}



