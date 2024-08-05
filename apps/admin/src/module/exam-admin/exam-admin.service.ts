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

        createdExam.title = `Exam: ${major} | ${city} | ${year}`;
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
        const city = details.city || exam.title.split(' | ')[1]




        exam.title = `Exam: ${major} | ${city} | ${year}`;
        exam.year = year;
        if (time) exam.time = time;
        if (addQuiz) exam.quizez += 1;
        if (deleteQuiz) exam.quizez -= 1;

        return await exam.save();
    }

    async checkByName(title: string) {
        const exam = await this.examModel.findOne({ title });
        if (exam) throw new HttpException('Exam already exists', 400);
    }

    async getById(id: Types.ObjectId) {
        const exam = await this.examModel.findById(id);
        if (!exam) throw new HttpException('Exam not found', 404);
        return exam;
    }

    //remove string from string
    async removeFromString(str: string, remove: string) {
        return str.replace(remove, '');
    }




}
