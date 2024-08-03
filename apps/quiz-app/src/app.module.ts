import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from '@app/common';
import { JwtAuthModule } from '@app/common/module/jwt-auth/jwt-auth.module';
import { OAuthModule } from './module/o-auth/o-auth.module';


@Module({
  imports: [
    DatabaseModule.forRoot(process.env.DB_NAME),
    JwtAuthModule.register(),
    AuthModule,
    OAuthModule,
  ],

})
export class AppModule { }
