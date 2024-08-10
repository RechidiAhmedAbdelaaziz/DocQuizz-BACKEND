import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule, HttpExceptionFilter } from '@app/common';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { OAuthModule } from './module/o-auth/o-auth.module';
import { UserModule } from './module/user/user.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExamModule } from './module/exam/exam.module';
import { ResponseInterceptor } from '@app/common/interceptors/response.interceptor';
import { ExamResultModule } from './module/exam-result/exam-result.module';
import { LevelsModule } from './module/levels/levels.module';
import { QuestionModule } from './module/question/question.module';
import { PlaylistModule } from './module/playlist/playlist.module';
import { QuizModule } from './module/quiz/quiz.module';


@Module({
  imports: [
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
    AuthModule,
    OAuthModule,
    UserModule,
    ExamModule,
    ExamResultModule,
    LevelsModule,
    QuestionModule,
    PlaylistModule,
    QuizModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],

})
export class AppModule { }
