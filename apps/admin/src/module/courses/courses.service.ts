import { AcademicField, Course } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name) private readonly courseModel: Model<Course>
    ) { }

    createCourse = async (field: AcademicField, title: string) => {

        const course = new this.courseModel();

        course.title = title;
        course.academicField = field;

        return await course.save()
    }

    updateCourse = async (course: Course, title?: string) => {
        if (title) course.title = title;
        return await course.save();
    }

    async deleteCourse(course: Course) {
        await course.deleteOne();
    }

    async getCourseById(id: Types.ObjectId) {
        const course = await this.courseModel.findById(id)
        if (!course) throw new HttpException('Course not found', 404)
        return course
    }
}
