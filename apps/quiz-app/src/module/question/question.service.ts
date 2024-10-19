import { Exam, Playlist, Question } from '@app/common/models';
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
            .populate('exams')
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
        // question : {exams : Exam[]} so exam should be in the exams array
        const filter: FilterQuery<Question> = { exams: { $in: [exam] } };

        const { generate, limit, page } = new Pagination(this.questionModel, { filter, ...options }).getOptions();

        const questions = await this.questionModel
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit).populate(['sources.source', 'course', 'exams'])

        return await generate(questions);
    }



    async getQuestionById(id: Types.ObjectId) {
        const question = await this.questionModel.findById(id);
        if (!question) throw new HttpException('Question not found', 404);
        return question;
    }

    generateFilterQuery(filters: QuestionFilter): FilterQuery<Question> {
        const { courses, difficulties, withoutExplanation, types, sources, year, exam, withExplanation, ids, keywords } = filters;

        const filter: FilterQuery<Question> = {};

        if (ids) filter._id = { $in: ids };
        if (courses) filter.course = { $in: courses };
        if (difficulties) filter.difficulties = { $in: difficulties };
        if (types) filter.type = { $in: types };
        if (exam) filter.exams = { $in: [exam] };

        const sourcesFilter: any = {}
        if (year) sourcesFilter.year = { $gte: year }
        if (sources) sourcesFilter.source = { $in: sources }
        if (year || sources) filter.sources = { $elemMatch: sourcesFilter };


        if (withExplanation && withoutExplanation) {
            filter.$or = [{ withExplanation: true }, { withExplanation: false }];
        } else if (withExplanation) {
            filter.withExplanation = true;
        }
        else if (withoutExplanation) {
            filter.withExplanation = false;
        }



        if (keywords) {
            filter.$and = [
                { $or: filter.$or },
                {
                    $or: [
                        { caseText: { $regex: keywords, $options: 'i' } },
                        { "questions.text": { $regex: keywords, $options: 'i' } },
                        { "questions.answers.text": { $regex: keywords, $options: 'i' } },
                    ]
                }
            ];
            delete filter.$or;
        }

        return filter;
    }






}
