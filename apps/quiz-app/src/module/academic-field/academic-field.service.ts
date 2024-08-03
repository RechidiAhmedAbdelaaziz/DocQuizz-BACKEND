import { AcademicField } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination-helper';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class AcademicFieldService {
    constructor(
        @InjectModel(AcademicField.name) private academicFieldModel: Model<AcademicField>,
    ) { }

    getAcademicFields = async (
        data: {
            name?: string;
            years?: number[];
        },
        options: {
            page?: number;
            limit?: number;
        }
    ) => {
        const { name, years } = data;

        const filter: FilterQuery<AcademicField> = {}

        if (name) filter.name = { $regex: name, $options: 'i' }
        if (years) filter.year = { $in: years }

        const { generate, limit, page } = new Pagination(this.academicFieldModel, { ...options, filter }).getOptions();

        const fields = await this.academicFieldModel
            .find(filter)
            .sort({ years: 1, semester: 1, name: 1 })
            .skip((page - 1) * limit)
            .limit(limit)


        return await generate(fields);
    }

    getAcademicField = async (id: Types.ObjectId) => {
        const field = await this.academicFieldModel.findById(id);
        if(!field) throw new HttpException('Academic Field not found', 404);
        return field;
    }
}
