import { Domain, Exam, Major } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class ExamService {

    constructor(
        @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
        private readonly subscriptionService: SubscriptionService
    ) { }

    getExams = async (
        options: {
            keywords?: string,
            search?: string,
            major?: Major
            year?: number,
            domain?: Domain
            userId: Types.ObjectId
        },
        paginationOptions: {
            page?: number,
            limit?: number
        }
    ) => {
        const { keywords, major, year, domain, search, userId } = options;
        const filter: FilterQuery<Exam> = {};


        const subs = (await this.subscriptionService.getSubscriptions({ user: userId }, {}))
        const levels = subs.data
            .map((sub) => sub.offer.levels)
            .flatMap((level) => level.map((l) => l._id));



        if (keywords) {
            filter.domain = domain;

            if (keywords === 'Résidanat') {
                filter.type = 'Résidanat';
            } else {
                filter.type = 'Résidanat blanc';
            }
        }

        if (major) {
            filter.major = major;
            filter.$or = [
                { type: 'Ratrappage' },
                { type: 'Externat' }
            ];
        }

        if (year) filter.year = year;

        if (search) {
            const keys = search.split(' ');
            filter.$and = keys.map(key => ({ title: { $regex: key, $options: 'i' } }));
        }



        const { generate, limit, page } = new Pagination(this.examModel, { ...paginationOptions, filter }).getOptions();

        const exams = await this.examModel.find(filter)
            .populate({
                path: 'major',
                select: 'name level',
                populate: 'level',
            })
            .populate('domain')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ "major.name": 1, year: -1, type: 1, group: 1, city: 1, });


        if (levels && levels.length > 0) {
            // if level is in levels make exam.isOpen = true
            exams.forEach((exam) => {
                exam.isOpen = levels.some((level) => {
                    return exam.major.level._id.toString() === level.toString();
                }
                );
            }
            );
        }


        return await generate(exams);
    }

    async getExamById(id: Types.ObjectId) {
        const exam = await this.examModel.findById(id);
        if (!exam) throw new HttpException('Exam non trouvé', 404);
        return exam;
    }
}
