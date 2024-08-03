import { Exam, Quizz, User } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ExamService {

    constructor(
        @InjectModel(Exam.name) private readonly examModel: Model<Exam>
    ) { }

    createExam = async (
        user: User,
        options: {
            quizzez: Quizz[],
            title: string
        }
    ) => {
        const { quizzez, title } = options

        const exam = new this.examModel()

        exam.title = title
        exam.user = user
        exam.questions = quizzez

        await exam.save()
    }

    getExamById = async (id : Types.ObjectId) => {
        return await this.examModel.findById(id)
    }

    getExams = async (
        user: User,
        options: {
            page?: number,
            limit?: number
        }
    ) => {
        return await this.examModel.find()
    }
}
