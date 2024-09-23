import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuestionService } from '../question/question.service';
import { UserService } from '../user/user.service';
import { CurrentUser, HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { CreateQuizBody } from './dto/create-quiz.dto';
import { ListQuizQuery } from './dto/list-quiz.dto';
import { UpdateQuizBody } from './dto/update-quiz.dto';
import { PaginationQuery } from '@app/common/utils/pagination';
import { NotesService } from '../notes/notes.service';
import { QuestionsNumberQuery } from './dto/question-number.dto';
import { NestedPagination } from '@app/common/utils/nested-pagination';
import { QuizRecordService } from '../quiz-record/quiz-record.service';

@Controller('quiz')
@UseGuards(HttpAuthGuard)
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly notesService: NotesService,
    private readonly recordService: QuizRecordService,
  ) { }

  @Post() //* QUIZ | Create ~ {{host}}/quiz
  async createQuiz(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: CreateQuizBody,
  ) {
    const { title, courses, difficulties, types, sources, year, alreadyAnsweredFalse, withExplanation, withNotes } = body

    const ids = []
    let sendIds: boolean = false

    const user = await this.userService.getUserById(userId)

    if (alreadyAnsweredFalse) {
      const answeredQuestions = await this.quizService.getAlreadyAnswerWrongQuestions(user)
      ids.push(...answeredQuestions); sendIds = true

    }
    if (withNotes) {
      const notes = await this.notesService.getNotedQuestions(user)
      ids.push(...notes); sendIds = true

    }

    const questionFilter = this.questionService.generateFilterQuery({ courses, difficulties, types, withExplanation, ids: sendIds ? ids : undefined, sources, year })


    const { data: questions } = await this.questionService.getQuestions(questionFilter, { limit: 500, min: 1 })

    return await this.quizService.createQuiz(user, { title, questions })
  }

  @Get() //* QUIZ | Get all ~ {{host}}/quiz?page=1&limit=10&keywords=keyword1 keyword2
  async getQuizes(
    @CurrentUser() userId: Types.ObjectId,
    @Query() query: ListQuizQuery,
  ) {
    const { page, limit, keywords } = query

    const user = await this.userService.getUserById(userId)
    return await this.quizService.getQuizes(user, { page, limit, keywords })
  }

  @Get('number') //* QUIZ | Question number ~ {{host}}/quiz/number
  async getQuizNumber(
    @CurrentUser() userId: Types.ObjectId,
    @Query() queries: QuestionsNumberQuery,
  ) {



    const { courses, difficulties, types, sources, year: yearString, alreadyAnsweredFalse, withExplanation, withNotes } = queries

    const year = yearString ? parseInt(yearString) : undefined


    const ids: Types.ObjectId[] = [];
    let sendIds: boolean = false;

    const user = await this.userService.getUserById(userId)

    if (alreadyAnsweredFalse) {
      const answeredQuestions = await this.quizService.getAlreadyAnswerWrongQuestions(user)
      ids.push(...answeredQuestions)
      sendIds = true
    }
    if (withNotes) {
      const notes = await this.notesService.getNotedQuestions(user)
      ids.push(...notes)
      sendIds = true

    }

    const questionFilter = this.questionService.generateFilterQuery({
      courses, difficulties, types, withExplanation, ids: sendIds ? ids : undefined, sources, year
    })

    const questions = await this.questionService.getQuestionsNumber(questionFilter);

    return { questions }
  }

  @Get(":quizId") //* QUIZ | Get Questions ~ {{host}}/quiz/:quizId?page=1&limit=10
  async getQuizQuestions(
    @Query() query: PaginationQuery,
    @CurrentUser() userId: Types.ObjectId,
    @Param("quizId", ParseMonogoIdPipe) quizId: Types.ObjectId
  ) {
    const { page, limit } = query

    const user = await this.userService.getUserById(userId)
    const quiz = await this.quizService.getQuizById(user, quizId, { populateOptions: { limit, page } })

    const { questions, ...quizData } = quiz.toJSON()


    const { data, pagination } = new NestedPagination(questions, { page, limit, total: quizData.totalQuestions }).generate();

    await this.recordService.createRecord(user, quiz)

    return {
      pagination,
      object: quizData,
      data,
    }
  }

  @Patch(":quizId") //* QUIZ | Update ~ {{host}}/quiz/:quizId
  async updateQuiz(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: UpdateQuizBody,
    @Param("quizId", ParseMonogoIdPipe) quizId: Types.ObjectId
  ) {
    const { title, isCompleted, time, questionAnswer, lastAnsweredIndex } = body

    const user = await this.userService.getUserById(userId)
    const quiz = await this.quizService.getQuizById(user, quizId, { withQuestions: true })


    return await this.quizService.updateQuiz(quiz, { title, isCompleted, questionAnswer, lastAnsweredIndex })
  }

  @Delete(":quizId") //* QUIZ | Delete ~ {{host}}/quiz/:quizId
  async deleteQuiz(
    @CurrentUser() userId: Types.ObjectId,
    @Param("quizId", ParseMonogoIdPipe) quizId: Types.ObjectId
  ) {
    const user = await this.userService.getUserById(userId)
    const quiz = await this.quizService.getQuizById(user, quizId)

    await this.quizService.deleteQuiz(quiz)

    return { message: "Quiz deleted successfully" }
  }

}

