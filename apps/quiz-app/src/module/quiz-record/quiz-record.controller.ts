import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { QuizRecordService } from './quiz-record.service';
import { CurrentUser, HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { QuizService } from '../quiz/quiz.service';
import { UserService } from '../user/user.service';

@Controller('quiz-record')
@UseGuards(HttpAuthGuard)
export class QuizRecordController {
  constructor(private readonly quizRecordService: QuizRecordService,
    private readonly userService: UserService,
    private readonly quizService: QuizService,

  ) { }

  @Post(':quizId') // * QUIZ | Start ~ {{host}}/quiz-record/:quizId
  async createRecord(
    @CurrentUser() userId: Types.ObjectId,
    @Param('quizId', ParseMonogoIdPipe) quizId: Types.ObjectId,
  ) {
    const user = await this.userService.getUserById(userId);
    const quiz = await this.quizService.getQuizById(user, quizId);

    await this.quizRecordService.createRecord(user, quiz);

    return { message: 'Quiz started successfully' }
  }
}
