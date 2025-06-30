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
        return await this.updatesModel.find().limit(10).sort({ date: -1 });
    }


    async getLastUpdateDate() {
        const lastUpdate = await this.updatesModel.findOne().sort({ date: -1 });
        return lastUpdate ? lastUpdate.date : undefined;
    }



}
