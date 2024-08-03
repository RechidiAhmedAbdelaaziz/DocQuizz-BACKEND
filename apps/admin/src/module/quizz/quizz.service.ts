import { AcademicField, Course, Quizz, Reference } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class QuizzService {

    constructor(
        @InjectModel(Quizz.name) private readonly quizzModel: Model<Quizz>
    ) { }

    createQuizz = async (data: {
        question: string;
        correctAnswers: string[]
        incorrectAnswers: string[]
        explanation?: string;
        difficulty: "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard"
        field: AcademicField
        course: Course
        reference: Reference
        notes: string[]
        year: number
    }) => {
        const { question, correctAnswers, incorrectAnswers, explanation, difficulty, field, course, notes, reference } = data;
        const quizz = new this.quizzModel();

        quizz.question = question;
        quizz.correctAnswers = correctAnswers;
        quizz.incorrectAnswers = incorrectAnswers;
        quizz.explanation = explanation;
        quizz.difficulty = difficulty;
        quizz.field = field;
        quizz.type = correctAnswers.length == 1 ? "QCU" : "QCM"
        quizz.course = course;
        quizz.notes = notes;
        quizz.reference = { ref: reference, year: data.year }

        course.quizzez += 1;
        field.quizzez += 1;

        await course.save();
        await field.save();

        return await quizz.save();
    }

    updateQuizz = async (quizz: Quizz, data: {

        question?: string;
        correctAnswers?: string[]
        incorrectAnswers?: string[]
        explanation?: string;
        difficulty?: "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard"
        field?: AcademicField
        course?: Course
        reference?: Reference
        notes?: string[]
        year?: number

    }) => {

        const { question, correctAnswers, incorrectAnswers, explanation, difficulty, field, course, notes, reference } = data;

        if (question) quizz.question = question;
        if (correctAnswers) {
            quizz.correctAnswers = correctAnswers;
            quizz.type = correctAnswers.length == 1 ? "QCU" : "QCM"
        }
        if (incorrectAnswers) quizz.incorrectAnswers = incorrectAnswers;
        if (explanation) quizz.explanation = explanation;
        if (difficulty) quizz.difficulty = difficulty;
        if (field) quizz.field = field;
        if (course) quizz.course = course;
        if (notes) quizz.notes = notes;
        if (reference && data.year) { quizz.reference = { ref: reference, year: data.year } }


        return await quizz.save();
    }

    deleteQuizz = async (Quizz: Quizz) => {
        await Quizz.deleteOne();

        Quizz.course.quizzez -= 1;
        Quizz.field.quizzez -= 1;

        const promises = [Quizz.course.save(), Quizz.field.save()]
        await Promise.all(promises)
    }

    getQuizz = async (id: Types.ObjectId) => {
        const quizz = await this.quizzModel.findById(id)
            .populate('field')
            .populate('course')
            .populate('reference')


        if (!quizz) throw new HttpException('Quizz not found', 404)
        return quizz
    }


}
