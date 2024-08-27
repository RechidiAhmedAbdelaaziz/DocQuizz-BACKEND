import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionBody } from './dto/create-question.dto';
import { ExamAdminService } from '../exam-admin/exam-admin.service';
import { ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { UpdateQuestionBody } from './dto/update-question.dto';
import { StatisticService } from '../statistic/statistic.service';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly examService: ExamAdminService,
    private readonly statisticService: StatisticService
  ) { }

  @Post() //* QUESTION | Create ~ {{host}}/question
  async createQuestion(@Body() body: CreateQuestionBody) {
    const { questionText, correctAnswers, wrongAnswers, difficulty, source, field, explanation } = body

    await this.questionService.checkQuestionExists(questionText)

    const exam = source ? await this.examService.getExamById(source) : undefined

    if (exam) await this.examService.updateExam(exam, { addQuiz: true })

    const question = await this.questionService.createQuestion({
      questionText,
      correctAnswers,
      wrongAnswers,
      difficulty,
      source: exam,
      field,
      explanation
    })

    await this.statisticService.updateStatistic({ newQuestion: 1 })

    return question
  }

  @Post(':questionId') //* QUESTION | Update ~ {{host}}/question/:questionId
  async updateQuestion(
    @Body() body: UpdateQuestionBody,
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId,
  ) {
    const { questionText, correctAnswers, wrongAnswers, difficulty, source, field, explanation } = body

    const question = await this.questionService.getQuestionById(questionId)
    const exam = source ? await this.examService.getExamById(source) : undefined

    return await this.questionService.updateQuestion(question, {
      questionText,
      correctAnswers,
      wrongAnswers,
      difficulty,
      source: exam,
      field,
      explanation
    })
  }

  @Delete(':questionId') //* QUESTION | Delete ~ {{host}}/question/:questionId
  async deleteQuestion(
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId
  ) {
    const question = await this.questionService.getQuestionById(questionId, { withExam: true })

    await this.questionService.deleteQuestionById(question)
    if (question.source) await this.examService.updateExam(question.source, { deleteQuiz: true })

    await this.statisticService.updateStatistic({ newQuestion: -1 })


    return { message: 'Question deleted successfully' }
  }
}
