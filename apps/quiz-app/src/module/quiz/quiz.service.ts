import { Question, User } from '@app/common/models';
import { Quiz } from '@app/common/models/quiz.model';
import { Pagination } from '@app/common/utils/pagination-helper';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    ) { }

    createQuiz = async (user: User, details: {
        questions: Question[],
        title: string
    }) => {
        const { questions, title } = details

        const quiz = new this.quizModel()

        quiz.title = title
        quiz.questions = questions.map(question => ({ question }))
        quiz.totalQuestions = questions.length
        quiz.user = user

        return await quiz.save()
    }

    getQuizes = async (user: User, options: {
        page?: number,
        limit?: number
        keywords?: string
    }) => {

        const { keywords } = options
        const filter: FilterQuery<Quiz> = { user }

        if (keywords) {
            const keywordsArray = keywords.split(' ')
            filter.$and = keywordsArray.map(keyword => ({ title: { $regex: keyword, $options: 'i' } }))
        }

        const { generate, limit, page } = new Pagination(this.quizModel, { filter, ...options }).getOptions()

        const quizes = await this.quizModel
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit)

        return await generate(quizes)
    }

    updateQuiz = async (quiz: Quiz, updates: {
        title?: string,
        questionAnswer?: {
            questionId: Types.ObjectId,
            isCorrect: boolean
        },
        time?: number,
        isCompleted?: boolean
    }) => {
        const { title, questionAnswer, time, isCompleted } = updates

        if (title) quiz.title = title
        if (time) quiz.result.time = time
        if (isCompleted) quiz.isCompleted = isCompleted


        if (questionAnswer) {
            const { questionId, isCorrect } = questionAnswer
            const questionStatus = this.getQuestionStatusInQuiz(quiz, questionId)

            const { isCorrect: currentIsCorrect } = questionStatus

            if (currentIsCorrect === undefined) { // if the question is not answered yet
                questionStatus.isCorrect = isCorrect
                quiz.result.answered += 1
                if (isCorrect) {
                    quiz.result.correct += 1
                }
            }
            else { // if the question is answered before
                if (currentIsCorrect !== isCorrect) {
                    questionStatus.isCorrect = isCorrect
                    isCorrect ? quiz.result.correct += 1 : quiz.result.correct -= 1
                }

            }

            quiz.markModified('questions')
            quiz.markModified('result')
        }

        return await quiz.save()
    }


    deleteQuiz = async (quiz: Quiz) => {
        await quiz.deleteOne()
    }

    async getAlreadyAnswerWrongQuestions(user: User) {
        const filter: FilterQuery<Quiz> = {
            user,
            isCompleted: true,
            'questions.isCorrect': false
        }

        const quizes = await this.quizModel
            .find(filter).select('questions')

        const questionsStatus = quizes.map(quiz => quiz.questions)
        const questions = questionsStatus.map(questions => questions.map(q => q.question._id))

        return questions.flat()
    }

    async getQuizById(
        user: User,
        quizId: Types.ObjectId,
        options?: {
            withQuestions?: boolean
            populateOptions?: {
                page?: number,
                limit?: number
            }
        }
    ) {
        const { withQuestions, populateOptions } = options || {}
        const page = populateOptions?.page || 1
        const limit = populateOptions?.limit || 15

        const query = this.quizModel.findOne({ _id: quizId, user })
        if (withQuestions) query.select('+questions')
        if (populateOptions) query
            .select({
                questions: { $slice: [(page - 1) * limit, limit] }
            })
            .populate({
                path: 'questions.question',
            })

        const quiz = await query.exec()
        if (!quiz) throw new HttpException('Quiz not found', 404)
        return quiz
    }

    private getQuestionStatusInQuiz = (quiz: Quiz, questionId: Types.ObjectId) => {
        console.log(quiz.questions)
        const questionStatus = quiz.questions.find(q => q.question._id.equals(questionId))
        if (!questionStatus) throw new HttpException('Question not found', 404)
        return questionStatus
    }

}
