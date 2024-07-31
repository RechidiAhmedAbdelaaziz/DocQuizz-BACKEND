import { Module } from '@nestjs/common';
import { QuizzModule } from './module/quizz/quizz.module';
import { AcademicFieldModule } from './module/academic-field/academic-field.module';
import { DatabaseModule } from '@app/common';
import { CoursesModule } from './module/courses/courses.module';

@Module({
  imports: [QuizzModule, AcademicFieldModule, DatabaseModule.forRoot(process.env.DB_NAME), CoursesModule],
  controllers: [],
  providers: [],
})
export class AdminModule { }
