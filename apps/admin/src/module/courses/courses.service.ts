import { AcademicField, Course } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course.name) private readonly courseModel: Model<Course>
    ) { }

    createCourse = async (field: AcademicField, title: string) => {

        const course = await this.courseModel.create({ title });

        field.courses.push(course);
        await field.save();

        return course
    }

    updateCourse = async (course: Course, title?: string) => {
        if (title) course.title = title;
        return await course.save();
    }

    async deleteCourse(field: AcademicField, course: Course) {
        await course.deleteOne();
        console.log(field.courses[0]._id.equals(course._id))
        field.courses = field.courses.filter(c => !c._id.equals(course._id));
        await field.save();
    }

    async getCourseById(id: Schema.Types.ObjectId) {
        const course = await this.courseModel.findById(id)
        if (!course) throw new HttpException('Course not found', 404)
        return course
    }
}
