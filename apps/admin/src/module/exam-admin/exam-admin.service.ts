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
            addQuiz?: number,
            group?: string
            type?: string
            changeGroup?: boolean

        }) => {

        const { time, addQuiz, type, city, group, major, year, domain, changeGroup } = details;

        if (time) exam.time = time;
        if (city) exam.city = city;
        if (major) exam.major = major;
        if (domain) exam.domain = domain;
        if (changeGroup) exam.group = group;
        if (type) exam.type = type;
        if (year) exam.year = year;
        if (addQuiz) exam.questions += addQuiz;

        if (time || city || major || domain || group || type)
            exam.title = `${type}${group ? `(${group}) ` : ' '}:${major ? ` ${major.name}` : domain ? ` ${domain.name}` : ''} | ${year} |  ${city}`;

        return await exam.save();
    }

    deleteExam = async (exam: Exam) => await exam.deleteOne();



    async checkByName(title: string) {
        const exam = await this.examModel.findOne({ title });
        if (exam) throw new HttpException('Examen déjà existant', 400);
    }

    async getExamById(id: Types.ObjectId) {
        const exam = await this.examModel.findById(id).populate('major').populate('domain');
        if (!exam) throw new HttpException('Examen introuvable', 404);
        return exam;
    }

    async getExams(options?: {
        ids?: Types.ObjectId[];
    }) {
        return await this.examModel.find(options.ids ? { _id: { $in: options.ids } } : {}).populate('major').populate('domain')
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
