import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ListExamQuery } from './dto/list-exams.dto';
import { ProGuard } from '@app/common';

@Controller('exam')
@UseGuards(ProGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @Get() //*  EXAM | Get all ~ {{host}}/exam
  async getExams(
    @Query() query: ListExamQuery
  ) {
    const { keys: keywords, limit, page } = query;

    return await this.examService.getExams({ keywords }, { limit, page });
  }
}
