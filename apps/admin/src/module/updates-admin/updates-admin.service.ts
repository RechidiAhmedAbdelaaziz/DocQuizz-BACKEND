import { Updates } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UpdatesAdminService {

    constructor(
        @InjectModel(Updates.name) private readonly updatesModel: Model<Updates>
    ) { }

    createUpdate = async (title: string, description: string) =>
        await this.updatesModel.create({ title, description })

    updateUpdate = async (update: Updates, data: {
        title?: string,
        description?: string
    }) => {

        if (data.title) update.title = data.title
        if (data.description) update.description = data.description

        return await update.save()
    }

    deleteUpdate = async (update: Updates) => await update.deleteOne()

    getUpdateById = async (id: Types.ObjectId) => {
        const update = await this.updatesModel.findById(id)
        if (!update) throw new HttpException('Update not found', 404)
        return update
    }

}
