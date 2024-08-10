import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuestionService } from '../question/question.service';
import { UserService } from '../user/user.service';
import { CurrentUser, HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { CreateQuizBody } from './dto/create-quiz.dto';
import { ListQuizQuery } from './dto/list-quiz.dto';
import { UpdateQuizBody } from './dto/update-quiz.dto';
import { query } from 'express';
import { PaginationQuery } from '@app/common/utils/pagination-helper';

@Controller('quiz')
@UseGuards(HttpAuthGuard)
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) { }

  @Post() //* QUIZ | Create ~ {{host}}/quiz
  async createQuiz(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: CreateQuizBody,
  ) {
    const { title, fields, difficulties, types, alreadyAnsweredFalse, withExplanation, withNotes } = body

    const questionFilter = this.questionService.generateFilterQuery({ fields, difficulties, types, alreadyAnsweredFalse, withExplanation, withNotes })

    const user = await this.userService.getUserById(userId)
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

  @Get(":quizId") //* QUIZ | Get Questions ~ {{host}}/quiz/:quizId?page=1&limit=10
  async getQuizQuestions(
    @Query() query: PaginationQuery,
    @CurrentUser() userId: Types.ObjectId,
    @Param("quizId", ParseMonogoIdPipe) quizId: Types.ObjectId
  ) {
    const { page, limit } = query

    const user = await this.userService.getUserById(userId)
    const quiz = await this.quizService.getQuizById(user, quizId, { populateOptions: { limit, page } })

    return quiz.questions
  }

  @Patch(":quizId") //* QUIZ | Update ~ {{host}}/quiz/:quizId
  async updateQuiz(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: UpdateQuizBody,
    @Param("quizId", ParseMonogoIdPipe) quizId: Types.ObjectId
  ) {
    const { title, isCompleted, time, questionAnswer } = body

    const user = await this.userService.getUserById(userId)
    const quiz = await this.quizService.getQuizById(user, quizId, { withQuestions: true })

    return await this.quizService.updateQuiz(quiz, { title, isCompleted, time, questionAnswer })
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
