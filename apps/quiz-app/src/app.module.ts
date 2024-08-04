import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule, HttpExceptionFilter } from '@app/common';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { OAuthModule } from './module/o-auth/o-auth.module';
import { UserModule } from './module/user/user.module';
import { APP_FILTER } from '@nestjs/core';


@Module({
  imports: [
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
    AuthModule,
    OAuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],

})
export class AppModule { }
