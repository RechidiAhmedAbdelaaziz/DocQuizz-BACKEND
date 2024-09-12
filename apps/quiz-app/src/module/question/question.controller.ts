import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionFilter } from './interface/question-filter';
import { ListQuestionsQuery } from './dto/list-questions.dto';
import { ExamService } from '../exam/exam.service';
import { AdminGuard } from '@app/common';

@Controller('question')
@UseGuards(AdminGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService,
    private readonly examService: ExamService


  ) { }

  @Get() //* QUESTION | Get all ~ {{host}}/question?page=1&limit=10&keywords=keyword
  async getQuestions(
    @Query() query: ListQuestionsQuery,
  ) {
    const { keywords, page, limit, types, difficulties, sources, examId, years : strings, courses, withExplanation } = query;

    const years = strings?.map(Number);

    const exam = examId ? await this.examService.getExamById(examId) : undefined;


    const filter = this.questionService.generateFilterQuery({
      difficulties, courses, exam, types, withExplanation, keywords, sources, years
    });

    return await this.questionService.getQuestions(filter, { page, limit });
  }


}
