import { Body, Controller, Get, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionFilter } from './interface/question-filter';
import { ListQuestionsBody, ListQuestionsQuery } from './dto/list-questions.dto';
import { ExamService } from '../exam/exam.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService,
    private readonly examService: ExamService


  ) { }

  @Get() //* QUESTION | Get all ~ {{host}}/question?page=1&limit=10&keywords=keyword
  async getQuestions(
    @Body() body: ListQuestionsBody,
    @Query() query: ListQuestionsQuery,
  ) {
    const { keywords, page, limit } = query;
    const { types, difficulties, source, fields, withExplanation } = body;


    const exam = source ? await this.examService.getExamById(source) : undefined;


    const filter = this.questionService.generateFilterQuery({
      difficulties, fields, source: exam, types, withExplanation, keywords
    });

    return await this.questionService.getQuestions(filter, { page, limit });
  }

  
}
