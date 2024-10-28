import { Module } from '@nestjs/common';
import { AdminGuard, DatabaseModule, HttpExceptionFilter } from '@app/common';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExamAdminModule } from './module/exam-admin/exam-admin.module';
import { ResponseInterceptor } from '@app/common/interceptors/response.interceptor';
import { LevelsModule } from './module/levels/levels.module';
import { QuestionModule } from './module/question/question.module';
import { StatisticModule } from './module/statistic/statistic.module';
import { SourceAdminModule } from './module/source-admin/source-admin.module';
import { UpdatesAdminModule } from './module/updates-admin/updates-admin.module';
import { ExamRecordModule } from './module/exam-record/exam-record.module';

@Module({
  imports: [
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
    ExamAdminModule,
    LevelsModule,
    QuestionModule,
    StatisticModule,
    SourceAdminModule,
    UpdatesAdminModule,
    ExamRecordModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AdminModule { }
