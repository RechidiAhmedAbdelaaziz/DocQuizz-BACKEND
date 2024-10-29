import { Exam, Major, Domain } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ExamAdminService {
    constructor(
        @InjectModel(Exam.name) private examModel: Model<Exam>,
    ) { }

    createExam = async (details: {
        major: Major,
        domain: Domain,
        time: number,
        year: number,
        city: string,
        group?: string,
        type: string

    }) => {
        const { major, time, year, city, type, group, domain } = details;

        const createdExam = new this.examModel();

        createdExam.time = time;
        createdExam.year = year;
        createdExam.city = city;
        createdExam.type = type;
        createdExam.group = group;
        createdExam.major = major;
        createdExam.domain = domain;




        createdExam.title = `${type}${group ? `(${group}) ` : ' '}:${major ? ` ${major.name}` : domain ? ` ${domain.name}` : ''} | ${year} |  ${city}`;



        return await createdExam.save();
    }

    updateExam = async (exam: Exam,
        details: {
            major?: Major,
            domain?: Domain,
            time?: number,
            year?: number,
            city?: string,
            addQuiz?: boolean,
            deleteQuiz?: boolean,
            group?: string
            type?: string

        }) => {

        const { time, addQuiz, deleteQuiz, type, city, group, major, year, domain } = details;

        exam.time = time;
        exam.year = year;
        exam.city = city;
        exam.type = type;
        exam.group = group;
        exam.major = major;
        exam.domain = domain;
        if (addQuiz) exam.questions += 1;
        if (deleteQuiz) exam.questions -= 1;

        exam.title = `${type}${group ? `(${group}) ` : ' '}:${major ? ` ${major.name}` : domain ? ` ${domain.name}` : ''} | ${year} |  ${city}`;

        return await exam.save();
    }

    deleteExam = async (exam: Exam) => await exam.deleteOne();



    async checkByName(title: string) {
        const exam = await this.examModel.findOne({ title });
        if (exam) throw new HttpException('Examen déjà existant', 400);
    }

    async getExamById(id: Types.ObjectId) {
        const exam = await this.examModel.findById(id);
        if (!exam) throw new HttpException('Examen introuvable', 404);
        return exam;
    }

    async getExams(options?: {
        ids?: Types.ObjectId[];
    }) {
        return await this.examModel.find(options.ids ? { _id: { $in: options.ids } } : {});
    }


    async getExamYears(
        filter?: {

            major?: Major,
            domain?: Domain,
            type?: string

        }) {
        const exams = await this.examModel.find(filter ? filter : {}).select('year').sort({ year: -1 });

        // get unique years
        return [...new Set(exams.map(exam => exam.year))];

    }






}
