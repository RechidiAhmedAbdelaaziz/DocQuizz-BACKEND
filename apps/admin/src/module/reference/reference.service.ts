import { Reference } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class ReferenceService {
    constructor(
        @InjectModel(Reference.name) private readonly referenceModel: Model<Reference>,
    ) { }

    createReference = async (title: string) => {
        const reference = await this.referenceModel.findOne({ title });
        if (reference) throw new HttpException('Reference already exists', 400)

        return await this.referenceModel.create({ title });
    }

    updateReference = async (reference: Reference, title?: string) => {
        if (title) reference.title = title;
        return await reference.save();
    }




    async getReference(filter: FilterQuery<Reference>) {
        const reference = await this.referenceModel.findOne(filter);
        if (!reference) throw new HttpException('Reference not found', 404);
        return reference;
    }
}
