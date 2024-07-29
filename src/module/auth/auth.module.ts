import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule, RefreshToken, RestPassworToken, User } from '@app/common';






@Module({
  imports: [
    DatabaseModule.forFeature(
      [
        { model: User },
        { model: RefreshToken },
        { model: RestPassworToken }
      ]
    ),

  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
