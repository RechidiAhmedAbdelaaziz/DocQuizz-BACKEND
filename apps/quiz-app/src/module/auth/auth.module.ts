import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '@app/common';
import { RefreshToken, RestPassworToken, User } from '@app/common/models';
import { StatisticModule } from '../statistic/statistic.module';
import { MailerModule } from '@app/common/module/mailer/mailer.module';
import { SubscriptionModule } from '../subscription/subscription.module';






@Module({
  imports: [
    DatabaseModule.forFeature(
      [
        { model: User },
        { model: RefreshToken },
        { model: RestPassworToken }
      ]
    ),
    StatisticModule,
    MailerModule,
    SubscriptionModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
