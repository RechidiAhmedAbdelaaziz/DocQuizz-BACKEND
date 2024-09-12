import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "@app/common/shared/abstract.model";
import { Schema } from "mongoose";


@DSchema()
export class Domain extends AbstractSchema {
    @Prop()
    name: string
}


@DSchema()
export class Level extends AbstractSchema {
    @Prop()
    name: string

    @Prop({ type: Schema.Types.ObjectId, ref: Domain.name, select: false })
    domain: Domain
}



@DSchema()
export class Major extends AbstractSchema {

    @Prop()
    name: string

    @Prop({ type: Schema.Types.ObjectId, ref: Domain.name, select: false })
    level: Level

}

@DSchema()
export class Course extends AbstractSchema {

    @Prop()
    name: string

    @Prop({ type: Schema.Types.ObjectId, ref: Major.name, select: false })
    major: Major

}

