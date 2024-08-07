import { Exam, Question } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination-helper';
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
        pagination: { page?: number, limit?: number },
    ) => {
        const { generate, limit, page } = new Pagination(this.questionModel, { filter, ...pagination }).getOptions();

        const questions = await this.questionModel
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit)

        return await generate(questions);
    }

    getQuestionsNumber = async (filter: FilterQuery<Question>) => {
        return await this.questionModel.countDocuments(filter);
    }


    async getQuestionById(id: Types.ObjectId) {
        const question = await this.questionModel.findById(id);
        if (!question) throw new HttpException('Question not found', 404);
        return question;
    }
    generateFilterQuery(filters: QuestionFilter): FilterQuery<Question> {
        const { fields, difficulties, types, source, alreadyAnsweredFalse, withExplanation, withNotes } = filters;

        const filter: FilterQuery<Question> = {};

        if (fields) filter.field = { $in: fields };
        if (difficulties) filter.difficulty = { $in: difficulties };
        if (types) filter.type = { $in: types };
        if (source) filter.source = source;
        if (withExplanation) filter.explanation = { $exists: true };
        //TODO implement alreadyAnsweredFalse and withNotes filters

        return filter;
    }
}
