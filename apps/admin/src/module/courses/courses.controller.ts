import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AcademicFieldService } from '../academic-field/academic-field.service';
import { Types } from 'mongoose';
import { ParseMonogoIdPipe } from '@app/common';
import { CreateCourseBody } from './dto/create-course.dto';
import { UpdateCourseBody } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly fieldService: AcademicFieldService
  ) { }

  @Post(":fieldId") //* COURSE | Create {{host}}/courses/:fieldId
  async createCourse(
    @Param("fieldId", ParseMonogoIdPipe) fieldId: Types.ObjectId,
    @Body() body: CreateCourseBody
  ) {
    const { title } = body;

    const field = await this.fieldService.getAcademicFieldById(fieldId);

    const course = await this.coursesService.createCourse(field, title)

    return course
  }

  @Patch(":courseId") //* COURSE | Update {{host}}/courses/:courseId
  async updateCourse(
    @Param("courseId", ParseMonogoIdPipe) courseId: Types.ObjectId,
    @Body() body: UpdateCourseBody
  ) {
    const { title } = body;

    const course = await this.coursesService.getCourseById(courseId);

    return this.coursesService.updateCourse(course, title);
  }

  @Delete(":courseId") //* COURSE | Delete {{host}}/courses/:courseId
  async deleteCourse(
    @Param("courseId", ParseMonogoIdPipe) courseId: Types.ObjectId,
  ) {
    const course = await this.coursesService.getCourseById(courseId);


    await this.coursesService.deleteCourse(course);

    return { message: "Course deleted successfully" };
  }
}
