import { Controller, Get, Param, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { AcademicFieldService } from '../academic-field/academic-field.service';
import { ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly academicFieldService: AcademicFieldService
  ) {}

  @Get(':academicFieldId') //* COURSE | Get courses ~ {{host}}/course/:academicFieldId
  async getCourses(
    @Param('academicFieldId' , ParseMonogoIdPipe) academicFieldId: Types.ObjectId,
    @Query('title') title?: string,
  ) {

    const academicField = await this.academicFieldService.getAcademicField(academicFieldId);

    return await this.courseService.getCourses(academicField, { title });
  }
}
