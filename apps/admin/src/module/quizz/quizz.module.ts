import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { DatabaseModule } from '@app/common';
import { Quizz } from '@app/common/models';
import { AcademicFieldModule } from '../academic-field/academic-field.module';
import { CoursesModule } from '../courses/courses.module';
import { ReferenceModule } from '../reference/reference.module';


@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Quizz }]),
    AcademicFieldModule,
    CoursesModule,
    ReferenceModule
  ],
  controllers: [QuizzController],
  providers: [QuizzService],
})
export class QuizzModule { }
