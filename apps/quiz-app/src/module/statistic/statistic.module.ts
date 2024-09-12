import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { DatabaseModule } from '@app/common';
import { Statistic } from '@app/common/models';
import { UserModule } from '../user/user.module';
import { QuizRecordModule } from '../quiz-record/quiz-record.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Statistic }]),
    UserModule, QuizRecordModule,
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService],

})
export class StatisticModule { }
