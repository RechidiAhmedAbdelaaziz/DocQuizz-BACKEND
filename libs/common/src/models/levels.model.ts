import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";



@DSchema()
export class Level extends AbstractSchema {

    @Prop()
    name: string

    @Prop({
        type: [{
            name: String,
            icon: String,
            courses: { type: [{ title: String, isFree: Boolean }], _id: false }
        }],
        select: false,
        _id: false
    })
    major: {
        name: string
        icon: string
        courses: {
            title: string,
            isFree: boolean,
        }[]
    }[]

}



