import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { HttpAuthGuard } from '@app/common';

@Controller('statistic')
@UseGuards(HttpAuthGuard)
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService
  ) { }

  @Get() //* STATISTIC | Get ~ {{host}}/statistic
  async getStatistic() {
    return await this.statisticService.getStatistics()
  }

}
