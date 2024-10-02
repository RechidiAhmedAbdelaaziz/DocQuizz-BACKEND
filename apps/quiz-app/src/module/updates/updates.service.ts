import { Updates } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UpdatesService {
    constructor(
        @InjectModel(Updates.name) private readonly updatesModel: Model<Updates>
    ) { }

    async getUpdates() {
        return await this.updatesModel.find()
    }




}
