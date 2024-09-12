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



    createQuestion = async (
        details: QuestionDetails
    ) => {
        const { questionText, year, correctAnswers, wrongAnswers, difficulty, exam, source, course, explanation } = details

        const question = new this.questionModel()

        question.questionText = questionText
        question.correctAnswers = correctAnswers
        question.wrongAnswers = wrongAnswers
        question.difficulty = difficulty
        question.type = correctAnswers.length > 1 ? "QCM" : "QCU"
        question.exam = exam
        question.course = course
        question.explanation = explanation ?? ''
        question.source = source
        question.year = year

        return question.save()
    }

    updateQuestion = async (
        question: Question,
        details: QuestionDetails
    ) => {
        const { questionText, correctAnswers, year, wrongAnswers, difficulty, exam, source, course, explanation } = details

        if (questionText) question.questionText = questionText
        if (correctAnswers) {
            question.correctAnswers = correctAnswers
            question.type = correctAnswers.length > 1 ? "QCM" : "QCU"
        }
        if (wrongAnswers) question.wrongAnswers = wrongAnswers
        if (difficulty) question.difficulty = difficulty
        if (exam) question.exam = exam
        if (source) question.source = source
        if (course) question.course = course
        if (explanation) question.explanation = explanation
        if (year) question.year = year

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
