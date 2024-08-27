import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '@app/common';
import { RefreshToken, RestPassworToken, User } from '@app/common/models';
import { StatisticModule } from '../statistic/statistic.module';






@Module({
  imports: [
    DatabaseModule.forFeature(
      [
        { model: User },
        { model: RefreshToken },
        { model: RestPassworToken }
      ]
    ),
    StatisticModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
