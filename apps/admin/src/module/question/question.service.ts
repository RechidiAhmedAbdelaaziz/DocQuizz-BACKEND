import { Question } from '@app/common/models/question.model';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuestionDetails } from './interface/question-details';
import { QuestionType } from '@app/common';

@Injectable()
export class QuestionService {
    constructor(
        @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    ) { }



    createOrUpdateQuestion = async (
        details: QuestionDetails, questionToUpdate?: Question
    ) => {
        const { caseText, questions, exams, sources, course ,images} = details
        const question = questionToUpdate || new this.questionModel({ difficulties: [] })


        for (let i = 0; i < questions.length; i++) {
            const correctAnswers = questions[i].answers.filter(answer => answer.isCorrect).length
            questions[i].type = correctAnswers > 1 ? QuestionType.QCM : QuestionType.QCU
            question.difficulties.push(questions[i].difficulty)
        }

        question.withExplanation = questions.some(q => q.explanation && (q.explanation.text || q.explanation.images?.length > 0))
        question.difficulties = [...new Set(question.difficulties)]

        if (caseText) {
            question.caseText = caseText
            question.type = QuestionType.CAS_CLINIQUE

        } else {
            question.type = questions[0].type
        }

        question.sortField = (caseText || questions[0].text)
            .trim()
            .toLowerCase()
            .normalize('NFD') // Normalize accented characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and dashes
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/-+/g, '-') // Replace multiple dashes with a single dash

        question.questions = questions
        question.exams = exams
        question.course = course
        question.sources = sources
        question.images = images


        return question.save()
    }

    // updateQuestion = async (
    //     question: Question,
    //     details: QuestionDetails
    // ) => {
    //     const { year, exam, source, course, questions, caseText } = details


    //     // modify type for each question in questions
    //     for (let i = 0; i < questions.length; i++) {
    //         const correctAnswers = questions[i].answers.filter(answer => answer.isCorrect).length
    //         questions[i].type = correctAnswers > 1 ? QuestionType.QCM : QuestionType.QCU
    //     }

    //     if (caseText) {
    //         question.caseText = caseText
    //         question.type = QuestionType.CAS_CLINIQUE
    //     } else {
    //         question.type = questions[0].type
    //     }

    //     question.questions = questions
    //     question.exam = exam
    //     question.source = source
    //     question.course = course
    //     question.year = year

    //     return question.save()
    // }

    deleteQuestionById = async (
        question: Question
    ) => {
        await question.deleteOne()
    }

    // async checkQuestionExists(questionText: string) {
    //     const question = await this.questionModel.findOne({ questionText })
    //     if (question) throw new HttpException('Question already exists', 400)
    // }

    async getQuestionById(id: Types.ObjectId, options?: { withExam: boolean }) {
        const { withExam } = options || { withExam: false }

        const question = await this.questionModel.findOne({ _id: id })
            .populate('sources.source')
            .populate({
                path: 'exams',
                populate: [{ path: 'major' }, { path: 'domain' }],
            })
            .populate('course');


        if (!question) throw new HttpException('Question not found', 404)

        return question
    }


}
