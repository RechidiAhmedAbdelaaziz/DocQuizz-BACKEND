import { Exam, Major } from '@app/common/models';
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
            major?: Major
        },
        paginationOptions: {
            page?: number,
            limit?: number
        }
    ) => {
        const { keywords, major } = options;
        const filter: FilterQuery<Exam> = {};

        if (keywords) {
            if (keywords === 'Résidanat') {
                filter.type = 'Résidanat';
            }
            else {
                const keywordsArray = keywords.split(' ');
                filter.$and = keywordsArray.map(keyword => ({
                    title: { $regex: keyword, $options: 'i' }
                }));
            }
        }

        if (major) {
            filter.major = major;
            filter.$or = [
                { type: 'Ratrappage' },
                { type: 'Externat' }
            ]
        }

        const { generate, limit, page } = new Pagination(this.examModel, { ...paginationOptions, filter }).getOptions();

        const exams = await this.examModel.find(filter)
            .populate('major')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ "major.name": 1, year: -1, type: 1, group: 1, city: 1, });

        return await generate(exams);
    }

    async getExamById(id: Types.ObjectId) {
        const exam = await this.examModel.findById(id);
        if (!exam) throw new HttpException('Exam non trouvé', 404);
        return exam;
    }
}
