import { Module } from '@nestjs/common';
import { QuizzModule } from './module/quizz/quizz.module';
import { AcademicFieldModule } from './module/academic-field/academic-field.module';
import { AdminGuard, DatabaseModule } from '@app/common';
import { CoursesModule } from './module/courses/courses.module';
import { ReferenceModule } from './module/reference/reference.module';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    QuizzModule,
    AcademicFieldModule,
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
    CoursesModule,
    ReferenceModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AdminModule { }
