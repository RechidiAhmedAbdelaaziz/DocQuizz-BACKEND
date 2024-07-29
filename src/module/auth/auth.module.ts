import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/models/user.model';
import { RefreshToken } from 'src/models/refresh-token.model';
import { DatabaseModule } from '@app/common/module/database/database.module';
import { RestPassworToken } from 'src/models/rest-password-token.model';
import { AppJwtModule } from '@app/common/module/app-jwt/app-jwt.module';





@Module({
  imports: [
    DatabaseModule.forFeature(
      [
        { model: User },
        { model: RefreshToken },
        { model: RestPassworToken }
      ]
    ),
    AppJwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
