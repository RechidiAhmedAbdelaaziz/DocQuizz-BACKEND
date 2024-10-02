import { Question, User } from '@app/common/models';
import { Quiz } from '@app/common/models/quiz.model';
import { Pagination } from '@app/common/utils/pagination';
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
        quiz.questions = questions.map(question => ({ question, result: undefined }))
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
            .sort("-createdAt")
            .skip((page - 1) * limit)
            .limit(limit)

        return await generate(quizes)
    }

    updateQuiz = async (quiz: Quiz, updates: {
        title?: string,
        questionAnswer?: {
            questionId: Types.ObjectId,
            choices: number[][],
            isCorrect: boolean[],
            time: number
        },
        isCompleted?: boolean,
        lastAnsweredIndex?: number,

    }) => {
        const { title, questionAnswer, lastAnsweredIndex, isCompleted } = updates

        if (title) quiz.title = title
        if (lastAnsweredIndex && lastAnsweredIndex < quiz.totalQuestions) quiz.lastAnsweredIndex = lastAnsweredIndex
        if (isCompleted) quiz.isCompleted = isCompleted

        if (questionAnswer) {
            const { questionId, isCorrect, choices, time } = questionAnswer
            const questionStatus = this.getQuestionStatusInQuiz(quiz, questionId)

            questionStatus.result = { isCorrect, choices, time, isAnswerd: true }


            quiz.result.answered = quiz.questions.filter(q => q.result.isAnswerd).length
            quiz.result.time = quiz.questions.reduce((acc, q) => acc + (q.result?.time || 0), 0)
            quiz.result.correct = quiz.questions.filter(q => q.result?.isCorrect.every(c=> c) ).length
            quiz.result.correctTime = quiz.questions.reduce((acc, q) => acc + (q.result?.isCorrect.every(c => c) ? (q.result.time || 0) : 0), 0)

            quiz.markModified('questions')
            quiz.markModified('result')

            const index = quiz.questions.findIndex(q => q.question._id.equals(questionId))

            if (isCorrect.every(c => c)) {
                quiz.coerrectIndexes.push(index)
                quiz.markModified('coerrectIndexes')
            } else {
                quiz.wrongIndexes.push({
                    questionIndex: index,
                    subQuestionIndexes: isCorrect.map((c, i) => c ? i : null).filter(i => i !== null)
                },)
                quiz.markModified('wrongIndexes')
            }



        }

        const { questions, ...details } = (await quiz.save()).toJSON()
        return details
    }

    deleteQuiz = async (quiz: Quiz) => {
        await quiz.deleteOne()
    }

    async getAlreadyAnswerWrongQuestions(user: User) {
        const filter: FilterQuery<Quiz> = {
            user,
            // isCompleted: true,
            //questions.result.isCorrect is an array of booleans 
            //if the question is answered wrong, all the elements in the array will be false
            //so we need get only the quizes that have at least one false in the array
            'questions.result.isCorrect': { $in: [false] }


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
                populate: [
                    { path: 'sources.source' },
                    { path: 'exam' },
                    { path: 'course' }
                ]
            })

        const quiz = await query.exec()
        if (!quiz) throw new HttpException('Quiz not found', 404)
        return quiz
    }

    private getQuestionStatusInQuiz = (quiz: Quiz, questionId: Types.ObjectId) => {

        const questionStatus = quiz.questions.find(q => q.question._id.equals(questionId))
        if (!questionStatus) throw new HttpException('Question not found', 404)
        return questionStatus
    }

}
