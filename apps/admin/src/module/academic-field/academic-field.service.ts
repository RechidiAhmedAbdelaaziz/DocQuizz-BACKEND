import { AcademicField } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination-helper';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Schema } from 'mongoose';

@Injectable()
export class AcademicFieldService {

    constructor(
        @InjectModel(AcademicField.name) private academicFieldModel: Model<AcademicField>
    ) { }

    createAcademicField = async (data: {
        year: number;
        semester: number;
        name: string;
        icon: string;
    }
    ) => {
        const { year, semester, name, icon } = data;

        const academicField = new this.academicFieldModel();

        academicField.year = year;
        academicField.semester = semester;
        academicField.name = name;
        academicField.icon = icon;

        return await academicField.save();
    }

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
            .skip((page - 1) * limit)
            .limit(limit)


        return await generate(fields);
    }

    getAcademicFieldById = async (id: Schema.Types.ObjectId) => {
        const field = await this.academicFieldModel.findById(id).populate('courses');
        if (!field) throw new HttpException('Field not found', 404);
        return field;
    }

    updateAcademicField = async (field: AcademicField, data: {
        year: number;
        semester: number;
        name: string;
        icon: string;
    }) => {
        const { year, semester, name, icon } = data;

        if (year) field.year = year
        if (semester) field.semester = semester
        if (name) field.name = name
        if (icon) field.icon = icon

        return await field.save();
    }

    deleteAcademicField = async (field: AcademicField) => {
        await field.deleteOne();
    }


}
