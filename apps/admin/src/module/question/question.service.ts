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
        const { questionText, year, answers, difficulty, exam, source, course, explanation } = details

        const question = new this.questionModel()

        const correctAnswersNumber = answers.filter(answer => answer.isCorrect).length

        question.questionText = questionText
        question.answers = answers
        question.difficulty = difficulty
        question.type = correctAnswersNumber > 1 ? "QCM" : "QCU"
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
        const { questionText, answers, year, difficulty, exam, source, course, explanation } = details

        question.questionText = questionText
        question.answers = answers
        question.type = (answers.filter(answer => answer.isCorrect).length > 1) ? "QCM" : "QCU"
        question.difficulty = difficulty
        question.exam = exam
        question.source = source
        question.course = course
        question.explanation = explanation
        question.year = year

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

        query.populate('exam')

        const question = await query.exec()
        if (!question) throw new HttpException('Question not found', 404)

        return question
    }


}
