import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateOrUpdateQuestionBody } from './dto/create-question.dto';
import { ExamAdminService } from '../exam-admin/exam-admin.service';
import { ParseMonogoIdPipe, QuestionType } from '@app/common';
import { Types } from 'mongoose';
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
  async createQuestion(@Body() body: CreateOrUpdateQuestionBody) {
    const { courseId, questions, caseText, examId, sources: sourceIds } = body

    // await this.questionService.checkQuestionExists(questionText)

    const exam = examId ? await this.examService.getExamById(examId) : undefined
    const course = courseId ? await this.levelService.getCourseById(courseId) : undefined
    const sources = sourceIds ? await Promise.all(sourceIds.map(async source => {
      const sourceE = await this.sourceService.getSourceById(source.sourceId)
      return { source: sourceE, year: source.year }
    })) : undefined;

    if (exam) await this.examService.updateExam(exam, { addQuiz: true })

    const question = await this.questionService.createOrUpdateQuestion({
      questions, caseText, course, exam, sources
    })

    await this.statisticService.updateStatistic({
      newQuestion: 1,
      newCC: question.type == QuestionType.CAS_CLINIQUE ? 1 : undefined,
    },)

    return question
  }

  @Post(':questionId') //* QUESTION | Update ~ {{host}}/question/:questionId
  async updateQuestion(
    @Body() body: CreateOrUpdateQuestionBody,
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId,
  ) {
    const { courseId, questions, caseText, examId, sources: sourceIds } = body




    const question = await this.questionService.getQuestionById(questionId)

    const exam = examId ? await this.examService.getExamById(examId) : undefined
    if (exam) {
      if (question.exam && exam.id !== question.exam.id) {
        await this.examService.updateExam(exam, { addQuiz: true })
        await this.examService.updateExam(question.exam, { deleteQuiz: true })
      }
      if (!question.exam) await this.examService.updateExam(exam, { addQuiz: true })
    }
    else if (question.exam) await this.examService.updateExam(question.exam, { deleteQuiz: true })


    const sources = sourceIds ? await Promise.all(sourceIds.map(async source => {
      const sourceE = await this.sourceService.getSourceById(source.sourceId)
      return { source: sourceE, year: source.year }
    })) : undefined;
    const course = courseId ? await this.levelService.getCourseById(courseId) : undefined

    return await this.questionService.createOrUpdateQuestion({
      questions,
      caseText,
      exam,
      course,
      sources,
    }, question)
  }

  @Delete(':questionId') //* QUESTION | Delete ~ {{host}}/question/:questionId
  async deleteQuestion(
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId
  ) {
    const question = await this.questionService.getQuestionById(questionId, { withExam: true })

    await this.questionService.deleteQuestionById(question)
    if (question.exam) await this.examService.updateExam(question.exam, { deleteQuiz: true })

    await this.statisticService.updateStatistic({
      newQuestion: -1,
      newCC: question.type == QuestionType.CAS_CLINIQUE ? -1 : undefined
    })


    return { message: 'Question deleted successfully' }
  }
}
