import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';

const jwtModule = JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '5h' },
})


@Module({
  imports: [
    DatabaseModule.forRoot('DocQuizz'),
    jwtModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
