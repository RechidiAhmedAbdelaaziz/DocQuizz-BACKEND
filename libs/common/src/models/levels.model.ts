import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";



@DSchema()
export class Level extends AbstractSchema {

    @Prop()
    name: string

    @Prop({ select: false })
    major: Major[]

}

@DSchema()
class Major {
    @Prop()
    name: string
    @Prop()
    icon: string
    @Prop()
    courses: string[]
}


