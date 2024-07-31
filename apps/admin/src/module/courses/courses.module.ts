import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import {  DatabaseModule } from '@app/common';
import { Course } from '@app/common/models';
import { AcademicFieldModule } from '../academic-field/academic-field.module';

@Module({
  imports : [
    DatabaseModule.forFeature([{model : Course}]),
    AcademicFieldModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
