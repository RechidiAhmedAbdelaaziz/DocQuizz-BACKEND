import { Source } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class SourceService {
    constructor(
        @InjectModel(Source.name) private readonly sourceModel: Model<Source>,
    ) { }


    getSources = async () => await this.sourceModel.find()
        .sort('title')
        .collation({ locale: "fr", strength: 1 });



}
