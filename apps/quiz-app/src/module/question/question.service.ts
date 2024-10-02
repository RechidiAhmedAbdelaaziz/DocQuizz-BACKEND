import { Exam, Question } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { QuestionFilter } from './interface/question-filter';

@Injectable()
export class QuestionService {

    constructor(
        @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    ) { }

    getQuestions = async (
        filter: FilterQuery<Question>,
        pagination: { page?: number, limit?: number, min?: number, keywords?: string },
    ) => {
        const { generate, limit, page } = new Pagination(this.questionModel, { filter, ...pagination }).getOptions();

        const questions = await this.questionModel
            .find(filter)
            .populate('sources.source')
            .populate('exam')
            .populate('course')
            .skip((page - 1) * limit)
            .limit(limit)

        if (pagination.min && questions.length < pagination.min) throw new HttpException(`There are less than ${pagination.min} questions that match the filter`, 400);

        return await generate(questions);
    }

    getQuestionsNumber = async (filter: FilterQuery<Question>) => {
        return await this.questionModel.countDocuments(filter);
    }

    getExamQuestions = async (
        exam: Exam,
        options?: {
            page?: number,
            limit?: number,
        }
    ) => {
        const filter: FilterQuery<Question> = { exam };

        const { generate, limit, page } = new Pagination(this.questionModel, { filter, ...options }).getOptions();

        const questions = await this.questionModel
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit).populate(['source', 'course', 'exam'])

        return await generate(questions);
    }

    async getQuestionById(id: Types.ObjectId) {
        const question = await this.questionModel.findById(id);
        if (!question) throw new HttpException('Question not found', 404);
        return question;
    }

    generateFilterQuery(filters: QuestionFilter): FilterQuery<Question> {
        const { courses, difficulties, types, sources, year, exam, withExplanation, ids, keywords } = filters;

        const filter: FilterQuery<Question> = {};

        if (ids) filter._id = { $in: ids };
        if (courses) filter.course = { $in: courses };
        if (difficulties) filter.difficulties = { $in: difficulties };
        if (types) filter.type = { $in: types };
        if (exam) filter.exam = exam;
        if (withExplanation) filter.withExplanation = withExplanation;

        const sourcesFilter: any = {}

        if (year) sourcesFilter.year = { $gte: year }
        if (sources) sourcesFilter.source = { $in: sources }

        if (year || sources) filter.sources = { $elemMatch: sourcesFilter };



        if (keywords) {
            const keywordsArray = keywords.split(' ');
            filter.$and = keywordsArray.map(keyword => ({
                questionText: { $regex: keyword, $options: 'i' }
            }));
        }

        return filter;
    }




}
