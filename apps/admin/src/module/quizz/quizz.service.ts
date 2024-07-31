import { AcademicField, Quizz } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

@Injectable()
export class QuizzService {

    constructor(
        @InjectModel(Quizz.name) private readonly quizzModel: Model<Quizz>
    ) { }

    createQuizz = async (data: {
        question: string;
        correctAnswers: string[],
        incorrectAnswers: string[],
        explanation?: string;
        difficulty: "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard";
        field: AcademicField;
    }) => {
        const { question, difficulty, field, correctAnswers, incorrectAnswers, explanation } = data;

        const quizz = new this.quizzModel();

        quizz.question = question;
        quizz.correctAnswers = correctAnswers;
        quizz.incorrectAnswers = incorrectAnswers;
        quizz.explanation = explanation;
        quizz.difficulty = difficulty;
        quizz.field = field;
        quizz.type = correctAnswers.length == 1 ? "QCU" : "QCM"

        return await quizz.save();
    }

    updateQuizz = async (quizz: Quizz, data: {
        question?: string;
        correctAnswers: string[],
        incorrectAnswers: string[],
        explanation?: string;
        difficulty?: "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard";
        field?: AcademicField;
    }) => {

        const { question, difficulty, field, correctAnswers, incorrectAnswers, explanation } = data;

        if (question) quizz.question = question;
        if (correctAnswers) {
            quizz.correctAnswers = correctAnswers;
            quizz.type = correctAnswers.length == 1 ? "QCU" : "QCM"
        }
        if (incorrectAnswers) quizz.incorrectAnswers = incorrectAnswers;
        if (explanation) quizz.explanation = explanation;
        if (difficulty) quizz.difficulty = difficulty;
        if (field) quizz.field = field;

        return await quizz.save();
    }

    deleteQuizz = async (Quizz: Quizz) => {
        await Quizz.deleteOne();
    }

    getQuizz = async (id: Schema.Types.ObjectId) => {
        const quizz = await this.quizzModel.findById(id)
        if (!quizz) throw new HttpException('Quizz not found', 404)
        return quizz
    }


}
