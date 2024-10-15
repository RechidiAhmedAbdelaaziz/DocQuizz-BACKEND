import { Exam } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ExamAdminService {
    constructor(
        @InjectModel(Exam.name) private examModel: Model<Exam>,
    ) { }

    createExam = async (details: {
        major: string,
        time: number,
        year: number,
        city: string
    }) => {
        const { major, time, year, city } = details;

        const createdExam = new this.examModel();

        createdExam.title = `Exam: ${major} | ${year} | ${city}`;
        createdExam.time = time;
        createdExam.year = year;

        return await createdExam.save();
    }

    updateExam = async (exam: Exam,
        details: {
            major?: string,
            time?: number,
            year?: number,
            city?: string,
            addQuiz?: boolean,
            deleteQuiz?: boolean
        }) => {

        const { time, addQuiz, deleteQuiz } = details;


        const major = details.major || exam.title.split(' | ')[0].replace('Exam: ', '');
        const year = details.year || exam.year;
        const city = details.city || exam.title.split(' | ')[2]




        exam.title = `Exam: ${major} | ${year} | ${city}`;
        exam.year = year;
        if (time) exam.time = time;
        if (addQuiz) exam.questions += 1;
        if (deleteQuiz) exam.questions -= 1;

        return await exam.save();
    }

    deleteExam = async (exam: Exam) => await exam.deleteOne();



    async checkByName(title: string) {
        const exam = await this.examModel.findOne({ title });
        if (exam) throw new HttpException('Exam already exists', 400);
    }

    async getExamById(id: Types.ObjectId) {
        const exam = await this.examModel.findById(id);
        if (!exam) throw new HttpException('Exam not found', 404);
        return exam;
    }

    async getExams(options?: {
        ids?: Types.ObjectId[];
    }) {
        return await this.examModel.find(options.ids ? { _id: { $in: options.ids } } : {});
    }







}
