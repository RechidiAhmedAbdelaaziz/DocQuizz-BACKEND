import { AcademicField, Course } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class CourseService {

    constructor(
        @InjectModel(Course.name) private courseModel: Model<Course>,
    ) { }

    getCourses = async (
        field : AcademicField,
        options: {
            title?: string;
        }
    ) => {
        const { title } = options
        
        const filter : FilterQuery<Course> = {academicField: field}
        if (title) filter.title = { $regex: title, $options: 'i' }

        return this.courseModel.find()
    }
}
