import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { DatabaseModule } from '@app/common';
import { Statistic } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Statistic }])
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService],
  
})
export class StatisticModule { }
