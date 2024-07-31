import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AcademicFieldService } from '../academic-field/academic-field.service';
import { Schema } from 'mongoose';
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
    @Param("fieldId", ParseMonogoIdPipe) fieldId: Schema.Types.ObjectId,
    @Body() body: CreateCourseBody
  ) {
    const { title } = body;

    const field = await this.fieldService.getAcademicFieldById(fieldId);

    return this.coursesService.createCourse(field, title);
  }

  @Patch(":courseId") //* COURSE | Update {{host}}/courses/:courseId
  async updateCourse(
    @Param("courseId", ParseMonogoIdPipe) courseId: Schema.Types.ObjectId,
    @Body() body: UpdateCourseBody
  ) {
    const { title } = body;

    const course = await this.coursesService.getCourseById(courseId);

    return this.coursesService.updateCourse(course, title);
  }

  @Delete(":fieldId/:courseId") //* COURSE | Delete {{host}}/courses/:fieldId/:courseId
  async deleteCourse(
    @Param("courseId", ParseMonogoIdPipe) courseId: Schema.Types.ObjectId,
    @Param("fieldId", ParseMonogoIdPipe) fieldId: Schema.Types.ObjectId
  ) {
    const course = await this.coursesService.getCourseById(courseId);
    const field = await this.fieldService.getAcademicFieldById(fieldId);


    await this.coursesService.deleteCourse(field, course);

    return { message: "Course deleted successfully" };
  }
}
