import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { ExamService } from '../exam/exam.service';
import { UserService } from '../user/user.service';
import { CurrentUser, HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { ListResultQuery } from './dto/list-result.dto';
import { UpdateResultBody } from './dto/update-result.dto';

@Controller('exam-result')
@UseGuards(HttpAuthGuard)
export class ExamResultController {
  constructor(
    private readonly examResultService: ExamResultService,
    private readonly examService: ExamService,
    private readonly userService: UserService
  ) { }

  @Post(':examId') //* EXAM | Start ~ {{host}}/exam-result/:examId
  async startExam(
    @CurrentUser() userId: Types.ObjectId,
    @Param('examId', ParseMonogoIdPipe) examId: Types.ObjectId
  ) {

    const exam = await this.examService.getExamById(examId);
    const user = await this.userService.getUserById(userId);

    const result = await this.examResultService.checkResultExists(user, exam) || await this.examResultService.createResult({ user, exam })

    return result
  }

  @Get() //* EXAM | Get taken ~ {{host}}/exam-result 
  async getResults(
    @CurrentUser() userId: Types.ObjectId,
    @Query() query: ListResultQuery
  ) {
    const { page, limit, keywords } = query;

    const user = await this.userService.getUserById(userId);

    return await this.examResultService.getResults(user, { keywords }, { page, limit });
  }

  @Patch(':examId') //* EXAM | Submit ~ {{host}}/exam-result/:examId
  async submitExam(
    @CurrentUser() userId: Types.ObjectId,
    @Param('examId', ParseMonogoIdPipe) examId: Types.ObjectId,
    @Body() body: UpdateResultBody
  ) {
    const { answerd, correct } = body

    const exam = await this.examService.getExamById(examId);
    const user = await this.userService.getUserById(userId);
    const result = await this.examResultService.getResult(user, exam);

    return await this.examResultService.updateResult(result, { answerd, correct });
  }

}
