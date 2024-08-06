import { Exam, ExamResult, User } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination-helper';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class ExamResultService {
    constructor(
        @InjectModel(ExamResult.name) private examResultModel: Model<ExamResult>,
    ) { }

    createResult = async (
        details: {
            user: User,
            exam: Exam,
        }
    ) => {
        const { user, exam } = details;

        const result = new this.examResultModel();

        result.user = user;
        result.exam = exam;

        return result.save();
    }

    getResults = async (
        user: User,
        options: {
            keywords?: string,
        },
        pagination: {
            page?: number,
            limit?: number,
        }
    ) => {

        const { keywords } = options;
        const filter: FilterQuery<ExamResult> = {};

        if (keywords) {
            const keywordsArray = keywords.split(' ');
            filter.$and = keywordsArray.map(keyword => ({
                'exam.title': { $regex: keyword, $options: 'i' }
            }));
        }

        const { generate, limit, page } = new Pagination(this.examResultModel, { ...pagination, filter }).getOptions();

        const results = await this.examResultModel.find({ user, ...filter })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('exam')

        return await generate(results);
    }

    async checkResultExists(user: User, exam: Exam) {
        const result = await this.examResultModel.findOne({ user, exam });
        if (result) throw new HttpException('You have already taken this exam', 400);
    }


}
