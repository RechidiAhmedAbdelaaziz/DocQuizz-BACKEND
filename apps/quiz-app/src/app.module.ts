import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from '@app/common';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { AcademicFieldModule } from './module/academic-field/academic-field.module';
import { CourseModule } from './module/course/course.module';
import { QuizzModule } from './module/quizz/quizz.module';
import { ExamModule } from './module/exam/exam.module';
import { OAuthModule } from './module/o-auth/o-auth.module';


@Module({
  imports: [
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
    AuthModule,
    AcademicFieldModule,
    CourseModule,
    QuizzModule,
    ExamModule,
    OAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
