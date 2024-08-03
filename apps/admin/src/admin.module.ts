import { Module } from '@nestjs/common';
import { AdminGuard, DatabaseModule } from '@app/common';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
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
