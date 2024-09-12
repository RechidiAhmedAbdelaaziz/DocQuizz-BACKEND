import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionBody } from './dto/create-question.dto';
import { ExamAdminService } from '../exam-admin/exam-admin.service';
import { ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { UpdateQuestionBody } from './dto/update-question.dto';
import { StatisticService } from '../statistic/statistic.service';
import { SourceAdminService } from '../source-admin/source-admin.service';
import { LevelsService } from '../levels/levels.service';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly examService: ExamAdminService,
    private readonly statisticService: StatisticService,
    private readonly sourceService: SourceAdminService,
    private readonly levelService: LevelsService,
  ) { }

  @Post() //* QUESTION | Create ~ {{host}}/question
  async createQuestion(@Body() body: CreateQuestionBody) {
    const { questionText, correctAnswers, year, wrongAnswers, difficulty, examId, sourceId, courseId, explanation } = body

    await this.questionService.checkQuestionExists(questionText)

    const exam = examId ? await this.examService.getExamById(examId) : undefined
    const source = sourceId ? await this.sourceService.getSourceById(sourceId) : undefined
    const course = courseId ? await this.levelService.getCourseById(courseId) : undefined


    if (exam) await this.examService.updateExam(exam, { addQuiz: true })

    const question = await this.questionService.createQuestion({
      questionText,
      correctAnswers,
      wrongAnswers,
      difficulty,
      exam,
      course,
      explanation,
      source,
      year,
    })

    await this.statisticService.updateStatistic({ newQuestion: 1 })

    return question
  }

  @Post(':questionId') //* QUESTION | Update ~ {{host}}/question/:questionId
  async updateQuestion(
    @Body() body: UpdateQuestionBody,
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId,
  ) {
    const { questionText, correctAnswers, year, wrongAnswers, difficulty, sourceId, examId, courseId, explanation } = body

    const question = await this.questionService.getQuestionById(questionId)
    const exam = examId ? await this.examService.getExamById(examId) : undefined
    const source = sourceId ? await this.sourceService.getSourceById(sourceId) : undefined
    const course = courseId ? await this.levelService.getCourseById(courseId) : undefined

    return await this.questionService.updateQuestion(question, {
      questionText,
      correctAnswers,
      wrongAnswers,
      difficulty,
      exam: exam,
      course,
      explanation,
      source,
      year
    })
  }

  @Delete(':questionId') //* QUESTION | Delete ~ {{host}}/question/:questionId
  async deleteQuestion(
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId
  ) {
    const question = await this.questionService.getQuestionById(questionId, { withExam: true })

    await this.questionService.deleteQuestionById(question)
    if (question.exam) await this.examService.updateExam(question.exam, { deleteQuiz: true })

    await this.statisticService.updateStatistic({ newQuestion: -1 })


    return { message: 'Question deleted successfully' }
  }
}
