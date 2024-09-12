import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CurrentUser, HttpAuthGuard } from '@app/common';
import { QuizRecordService } from '../quiz-record/quiz-record.service';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';

@Controller('statistic')
@UseGuards(HttpAuthGuard)
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService,
    private readonly recordService: QuizRecordService,
    private readonly userService: UserService,
  ) { }

  @Get() //* STATISTIC | Get ~ {{host}}/statistic
  async getStatistic(
    @CurrentUser() userId: Types.ObjectId,
  ) {

    const user = await this.userService.getUserById(userId);

    const statistic = await this.statisticService.getStatistics();
    const quizDoneToday = await this.recordService.getRecordsNumber(user);

    return { ...statistic.toJSON(), quizDoneToday }
  }

}
