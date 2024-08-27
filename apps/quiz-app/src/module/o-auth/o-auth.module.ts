import { Module } from '@nestjs/common';
import { OAuthService } from './o-auth.service';
import { OAuthController } from './o-auth.controller';
import { AuthModule } from '../auth/auth.module';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [AuthModule, StatisticModule],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule { }
