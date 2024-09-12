import { Source } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class SourceService {
    constructor(
        @InjectModel(Source.name) private readonly sourceModel: Model<Source>,
    ) { }

    createSource = async (title: string) => {
        const source = new this.sourceModel({ title });
        return await source.save();
    }

    updateSource = async (source: Source, title: string) => {
        source.title = title;
        return await source.save();
    }

    deleteSource = async (source: Source) => await source.deleteOne();

    getSources = async () => await this.sourceModel.find();

    async getSourceById(id: Types.ObjectId) {
        const source = await this.sourceModel.findById(id);
        if (!source) throw new HttpException('Source not found', 404);
        return source;
    }


}
