import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionBody } from './dto/create-question.dto';
import { ExamAdminService } from '../exam-admin/exam-admin.service';
import { ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { UpdateQuestionBody } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly examService: ExamAdminService
  ) { }

  @Post() //* QUESTION | Create ~ {{host}}/question
  async createQuestion(@Body() body: CreateQuestionBody) {
    const { questionText, correctAnswers, wrongAnswers, difficulty, source, field, explanation } = body

    await this.questionService.checkQuestionExists(questionText)

    const exam = source ? await this.examService.getExamById(source) : undefined

    if (exam) await this.examService.updateExam(exam, { addQuiz: true })

    return await this.questionService.createQuestion({
      questionText,
      correctAnswers,
      wrongAnswers,
      difficulty,
      source: exam,
      field,
      explanation
    })
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
    await this.examService.updateExam(question.source, { deleteQuiz: true })

    return { message: 'Question deleted successfully' }
  }
}
