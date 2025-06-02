import { Exam, Playlist, Question } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { QuestionFilter } from './interface/question-filter';
import path from 'path';
import { QuestionType } from '@app/common';
import { Type } from 'class-transformer';

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

        const questions = await this.questionModel.aggregate([
            { $match: filter },
            {
                $addFields: {
                    isCasClinique: {
                        $cond: { if: { $eq: ['$type', QuestionType.CAS_CLINIQUE] }, then: 1, else: 0 },
                    },
                },
            },
            {
                $lookup: {
                    from: 'sources',
                    localField: 'sources.source',
                    foreignField: '_id',
                    as: 'populatedSources',
                },
            },
            {
                $addFields: {
                    sources: {
                        $map: {
                            input: '$sources',
                            as: 'src',
                            in: {
                                source: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$populatedSources',
                                                as: 'popSrc',
                                                cond: { $eq: ['$$popSrc._id', '$$src.source'] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                year: '$$src.year'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    populatedSources: 0
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'course',
                },
            },
            {
                $addFields: {
                    course: { $arrayElemAt: ['$course', 0] },
                },
            },
            {
                $lookup: {
                    from: 'exams',
                    localField: 'exams',
                    foreignField: '_id',
                    as: 'exams',
                },
            },
            // Remove course.major and exams.major
            {
                $project: {
                    'course.major': 0,
                    'exams.major': 0,
                    'exam.domain': 0,
                }
            },
            { $sort: { isCasClinique: 1, sortField: 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ]);



        // If necessary, you can also handle nested populates manually by performing additional lookups or programmatically.



        if (pagination.min && questions.length < pagination.min) throw new HttpException(`Il n'y a pas assez de questions`, 404);

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
        const filter: FilterQuery<Question> = { exams: { $in: [new Types.ObjectId(exam._id)] } };

        const { generate, limit, page } = new Pagination(this.questionModel, { filter, ...options }).getOptions();
        const questions = await this.questionModel.aggregate([
            { $match: filter },
            {
                $addFields: {
                    isCasClinique: {
                        $cond: { if: { $eq: ['$type', QuestionType.CAS_CLINIQUE] }, then: 1, else: 0 },
                    },
                },
            },
            {
                $lookup: {
                    from: 'sources',
                    localField: 'sources.source',
                    foreignField: '_id',
                    as: 'populatedSources',
                },
            },
            {
                $addFields: {
                    sources: {
                        $map: {
                            input: '$sources',
                            as: 'src',
                            in: {
                                source: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$populatedSources',
                                                as: 'popSrc',
                                                cond: { $eq: ['$$popSrc._id', '$$src.source'] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                year: '$$src.year'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    populatedSources: 0
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'course',
                },
            },
            {
                $addFields: {
                    course: { $arrayElemAt: ['$course', 0] },
                },
            },
            {
                $lookup: {
                    from: 'exams',
                    localField: 'exams',
                    foreignField: '_id',
                    as: 'exams',
                },
            },
            // Remove course.major and exams.major
            {
                $project: {
                    'course.major': 0,
                    'exams.major': 0,
                    'exam.domain': 0,
                }
            },
            { $sort: { isCasClinique: 1, sortField: 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ]);


        return await generate(questions);
    }



    async getQuestionById(id: Types.ObjectId) {
        const question = await this.questionModel.findById(id);
        if (!question) throw new HttpException('Question not found', 404);
        return question;
    }

    generateFilterQuery(filters: QuestionFilter): FilterQuery<Question> {
        const { courses, difficulties, withoutExplanation, types, sources, year, years, exam, withExplanation, ids: ids_, keywords } = filters;

        const filter: FilterQuery<Question> = {};

        let ids: Types.ObjectId[];


        // get items that in all arrays of ids_
        if (ids_) {
            const tmp: Types.ObjectId[] = [];
            for (const id of ids_) {
                tmp.push(...id);
            }

            ids = tmp.filter((id) => {


                const includes = ids_.every((ids) => {
                    for (const id_ of ids) {
                        if (id_.equals(id)) return true;
                    }
                });
                return includes;
            });

        }






        if (ids) filter._id = { $in: ids.map(id => new Types.ObjectId(id)) };
        if (courses) filter.course = { $in: courses.map(id => new Types.ObjectId(id)) };
        if (difficulties) filter.difficulties = { $in: difficulties };
        if (types) filter.type = { $in: types };
        if (exam) filter.exams = { $in: [new Types.ObjectId(exam._id)] };

        const sourcesFilter: any = {};
        if (year) sourcesFilter.year = { $gte: year };
        if (sources) sourcesFilter.source = { $in: sources.map(id => new Types.ObjectId(id)) };
        if (year || sources) filter.sources = { $elemMatch: sourcesFilter };

        if (years) filter.sources = { $elemMatch: { year: { $in: years } } };

        if (withExplanation && withoutExplanation) {
            filter.$or = [{ withExplanation: true }, { withExplanation: false }];
        } else if (withExplanation) {
            filter.withExplanation = true;
        } else if (withoutExplanation) {
            filter.withExplanation = { $ne: true };
        }

        // Prepare the keywords filter
        let keywordFilter = [];
        if (keywords) {
            keywordFilter = [
                { caseText: { $regex: keywords, $options: 'i' } },
                { "questions.text": { $regex: keywords, $options: 'i' } },
                { "questions.answers.text": { $regex: keywords, $options: 'i' } }
            ];
        }

        // Combine conditions
        if (keywords) {
            filter.$and = [];

            // Add the withExplanation filter if $or is present
            if (filter.$or && filter.$or.length > 0) {
                filter.$and.push({ $or: filter.$or });
            }

            // Add the keyword filter
            filter.$and.push({ $or: keywordFilter });

            // Clean up $or since it's now moved to $and
            delete filter.$or;
        }

        return filter;
    }






}
