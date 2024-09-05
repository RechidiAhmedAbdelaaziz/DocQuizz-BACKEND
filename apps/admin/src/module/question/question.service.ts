import { Question } from '@app/common/models/question.model';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuestionDetails } from './interface/question-details';

@Injectable()
export class QuestionService {
    constructor(
        @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    ) { }

    getAllQuestions = async (
        fitler: {
            field?: {
                level?: string,
                major?: string,
                course?: string
            },
            difficulty?: "easy" | "medium" | "hard",
            type?: "QCM" | "QCU",
            source?: Types.ObjectId
        },
        pagination: {
            page?: number,
            limit?: number,
        }


    ) => { }

    createQuestion = async (
        details: QuestionDetails
    ) => {
        const { questionText, correctAnswers, wrongAnswers, difficulty, source, field, explanation } = details

        const question = new this.questionModel()

        question.questionText = questionText
        question.correctAnswers = correctAnswers
        question.wrongAnswers = wrongAnswers
        question.difficulty = difficulty
        question.type = correctAnswers.length > 1 ? "QCM" : "QCU"
        question.source = source
        question.field = field
        question.explanation = explanation ?? ''

        return question.save()
    }

    updateQuestion = async (
        question: Question,
        details: QuestionDetails
    ) => {
        const { questionText, correctAnswers, wrongAnswers, difficulty, source, field, explanation } = details

        if (questionText) question.questionText = questionText
        if (correctAnswers) {
            question.correctAnswers = correctAnswers
            question.type = correctAnswers.length > 1 ? "QCM" : "QCU"
        }
        if (wrongAnswers) question.wrongAnswers = wrongAnswers
        if (difficulty) question.difficulty = difficulty
        if (source) question.source = source
        if (field) question.field = field
        if (explanation) question.explanation = explanation

        return question.save()
    }

    deleteQuestionById = async (
        question: Question
    ) => {
        await question.deleteOne()
    }

    async checkQuestionExists(questionText: string) {
        const question = await this.questionModel.findOne({ questionText })
        if (question) throw new HttpException('Question already exists', 400)
    }

    async getQuestionById(id: Types.ObjectId, options?: { withExam: boolean }) {
        const { withExam } = options || { withExam: false }

        const query = this.questionModel.findById(id)

        if (withExam) query.populate('source')

        const question = await query.exec()
        if (!question) throw new HttpException('Question not found', 404)

        return question
    }


}
