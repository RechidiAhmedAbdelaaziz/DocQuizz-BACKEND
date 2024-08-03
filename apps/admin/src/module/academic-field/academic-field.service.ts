import { AcademicField } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model, Types } from 'mongoose';

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



    getAcademicFieldById = async (id: Types.ObjectId) => {
        const field = await this.academicFieldModel.findById(id)
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
