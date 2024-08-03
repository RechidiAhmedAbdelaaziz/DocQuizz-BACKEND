import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DatabaseModule } from '@app/common';
import { Course } from '@app/common/models';
import { AcademicFieldModule } from '../academic-field/academic-field.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Course }]),
    AcademicFieldModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
