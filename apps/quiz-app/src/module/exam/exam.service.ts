import { Exam } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class ExamService {

    constructor(
        @InjectModel(Exam.name) private readonly examModel: Model<Exam>
    ) { }

    getExams = async (
        options: {
            keywords?: string,
        },
        paginationOptions: {
            page?: number,
            limit?: number
        }
    ) => {
        const { keywords } = options;
        const filter: FilterQuery<Exam> = {};

        if (keywords) {
            const keywordsArray = keywords.split(' ');
            filter.$and = keywordsArray.map(keyword => ({
                title: { $regex: keyword, $options: 'i' }
            }));
        }

        const { generate, limit, page } = new Pagination(this.examModel, { ...paginationOptions, filter }).getOptions();

        const exams = await this.examModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ year: 1, title: 1 })

        return await generate(exams);
    }

    async getExamById(id: Types.ObjectId) {
        const exam = await this.examModel.findById(id);
        if (!exam) throw new HttpException('Exam not found', 404);
        return exam;
    }
}
