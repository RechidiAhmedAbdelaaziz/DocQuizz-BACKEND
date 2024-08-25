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
import { PaginationQuery } from '@app/common/utils/pagination';
import { NotesService } from '../notes/notes.service';
import { QuestionsNumberBody } from './dto/question-number.dto';

@Controller('quiz')
@UseGuards(HttpAuthGuard)
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly notesService: NotesService
  ) { }

  @Post() //* QUIZ | Create ~ {{host}}/quiz
  async createQuiz(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: CreateQuizBody,
  ) {
    const { title, fields, difficulties, types, alreadyAnsweredFalse, withExplanation, withNotes } = body

    const ids = []

    const user = await this.userService.getUserById(userId)

    if (alreadyAnsweredFalse) {
      const answeredQuestions = await this.quizService.getAlreadyAnswerWrongQuestions(user)
      ids.push(answeredQuestions)
    }
    if (withNotes) {
      const notes = await this.notesService.getNotedQuestions(user)
      ids.push(notes)
    }

    const questionFilter = this.questionService.generateFilterQuery({ fields, difficulties, types, withExplanation, ids })


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
    @Body() body: QuestionsNumberBody,
  ) {
    const { fields, difficulties, types, alreadyAnsweredFalse, withExplanation, withNotes } = body

    const ids = []

    const user = await this.userService.getUserById(userId)

    if (alreadyAnsweredFalse) {
      const answeredQuestions = await this.quizService.getAlreadyAnswerWrongQuestions(user)
      ids.push(answeredQuestions)
    }
    if (withNotes) {
      const notes = await this.notesService.getNotedQuestions(user)
      ids.push(notes)
    }

    const questionFilter = this.questionService.generateFilterQuery({ fields, difficulties, types, withExplanation, ids })

    const data = await this.questionService.getQuestionsNumber(questionFilter);

    console.log(data)
    return data > 0 ? { data } : { message: "No questions found" }
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

    const total = quiz.totalQuestions;
    const currentPage = Math.min(page, Math.ceil(total / limit || 15));
    const { questions: list, ...quizData } = quiz.toJSON()

    return {
      pagination: {
        page: currentPage || 0,
        length: list.length,
        next: total > currentPage * limit ? currentPage + 1 : undefined,
        prev: currentPage > 1 ? currentPage - 1 : undefined,
      },
      data: {
        quiz: quizData,
        data: list
      }
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

    if (questionAnswer) {
      const question = await this.questionService.getQuestionById(questionAnswer.questionId)

      await this.userService.updateAnalyse(user, {
        major: question.field.major,
        isCorrectAnswers: questionAnswer.isCorrect
      })
    }

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
