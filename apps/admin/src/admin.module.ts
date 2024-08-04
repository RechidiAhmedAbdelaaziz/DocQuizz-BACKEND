import { Module } from '@nestjs/common';
import { AdminGuard, DatabaseModule } from '@app/common';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ExamAdminModule } from './module/exam-admin/exam-admin.module';

@Module({
  imports: [
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
    ExamAdminModule,
    ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AdminModule { }
