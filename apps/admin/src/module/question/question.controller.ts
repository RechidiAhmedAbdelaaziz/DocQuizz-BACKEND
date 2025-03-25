import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateOrUpdateQuestionBody } from './dto/create-question.dto';
import { ExamAdminService } from '../exam-admin/exam-admin.service';
import { ParseMonogoIdPipe, QuestionType, SkipAdminGuard } from '@app/common';
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

  @SkipAdminGuard()
  @Post() //* QUESTION | Create ~ {{host}}/question
  async createQuestion(@Body() body: CreateOrUpdateQuestionBody) {
    const { courseId, questions, caseText, examIds, sources: sourceIds } = body

    // await this.questionService.checkQuestionExists(questionText)

    const exams = examIds ? await this.examService.getExams({ ids: examIds }) : undefined
    const course = courseId ? await this.levelService.getCourseById(courseId) : undefined
    const sources = sourceIds ? await Promise.all(sourceIds.map(async source => {
      const sourceE = await this.sourceService.getSourceById(source.sourceId)
      return { source: sourceE, year: source.year }
    })) : undefined;

    if (exams) await Promise.all(exams.map(async exam => { await this.examService.updateExam(exam, { addQuiz: true }) }))

    const question = await this.questionService.createOrUpdateQuestion({
      questions, caseText, course, exams, sources
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
    const { courseId, questions, caseText, examIds, sources: sourceIds  } = body




    const question = await this.questionService.getQuestionById(questionId)

    const exams = examIds ? await this.examService.getExams({ ids: examIds }) : [];
    const sources = sourceIds ? await Promise.all(sourceIds.map(async source => {
      const sourceE = await this.sourceService.getSourceById(source.sourceId)
      return { source: sourceE, year: source.year }
    })) : undefined;
    const course = courseId ? await this.levelService.getCourseById(courseId) : undefined


    const examsNotInQuestion = exams.filter(exam => !question.exams.find(e => e.id == exam.id))
    const examsNotInExams = question.exams.filter(exam => !exams.find(e => e.id == exam.id))

    for (const exam of examsNotInQuestion) await this.examService.updateExam(exam, { addQuiz: true })

    for (const exam of examsNotInExams) await this.examService.updateExam(exam, { deleteQuiz: true })

    return await this.questionService.createOrUpdateQuestion({
      questions,
      caseText,
      exams,
      course,
      sources,
    }, question);

  }

  @Delete(':questionId') //* QUESTION | Delete ~ {{host}}/question/:questionId
  async deleteQuestion(
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId
  ) {
    const question = await this.questionService.getQuestionById(questionId, { withExam: true })

    await this.questionService.deleteQuestionById(question)
    for (const exam of question.exams) {
      await this.examService.updateExam(exam, { deleteQuiz: true })
    }

    await this.statisticService.updateStatistic({
      newQuestion: -1,
      newCC: question.type == QuestionType.CAS_CLINIQUE ? -1 : undefined
    })


    return { message: 'Question deleted successfully' }
  }
}
