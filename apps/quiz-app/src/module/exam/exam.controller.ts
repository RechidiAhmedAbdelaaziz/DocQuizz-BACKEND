import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ListExamQuery } from './dto/list-exams.dto';
import { HttpAuthGuard, ParseMonogoIdPipe, ProGuard } from '@app/common';
import { QuestionService } from '../question/question.service';
import { Types } from 'mongoose';
import { PaginationQuery } from '@app/common/utils/pagination';
import { LevelsService } from '../levels/levels.service';

@Controller('exam')
// @UseGuards(ProGuard) //TODO after implemnt payment
@UseGuards(HttpAuthGuard)
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly questionService: QuestionService,
    private readonly majorService: LevelsService,
  ) { }

  @Get() //*  EXAM | Get all ~ {{host}}/exam
  async getExams(
    @Query() query: ListExamQuery
  ) {
    const { keywords, limit, page, majorId, year: yearString, domainId } = query;
    const year = yearString ? parseInt(yearString) : undefined;

    const major = majorId ? await this.majorService.getMajorById(majorId) : undefined;
    const domain = domainId ? await this.majorService.getDomainById(domainId) : undefined;

    return await this.examService.getExams({ keywords, major, year, domain }, { limit, page });
  }

  @Get(":examId") //* EXAM | Get Questions ~ {{host}}/exam/:examId?page=1&limit=10
  async getExamQuestions(
    @Query() query: PaginationQuery,
    @Param("examId", ParseMonogoIdPipe) examId: Types.ObjectId
  ) {
    const { limit, page } = query;

    const exam = await this.examService.getExamById(examId);

    const { data, pagination } = await this.questionService.getExamQuestions(exam, { limit, page });

    return {
      pagination,
      object: exam,
      data: data,
    }
  }
}
