import { AcademicField, Quizz, Course, Reference } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination-helper';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { QuizzFilters } from './interface/quizz.filters';

@Injectable()
export class QuizzService {

    constructor(
        @InjectModel(Quizz.name) private readonly quizzModel: Model<Quizz>
    ) { }

    getQuizzez = async (
        filters: QuizzFilters,
        options: {
            page?: number,
            limit?: number
        }

    ) => {
        const { fields, courses, references, difficulties, types, years, withExplanation, withNotes } = filters;

        const filter: FilterQuery<Quizz> = {};

        if (fields) filter.field = { $in: fields.map(f => f._id) }
        if (courses) filter.course = { $in: courses.map(c => c._id) }
        if (references) filter.reference = { $in: references.map(r => r._id) }
        if (difficulties) filter.difficulty = { $in: difficulties }
        if (types) filter.type = { $in: types }
        if (years) filter.reference.year = { $in: years }
        if (withExplanation) filter.explanation = { $exists: true }
        if (withNotes) filter.notes = { $exists: true }

        const { generate, limit, page } = new Pagination(this.quizzModel, { ...options, filter }).getOptions()

        const quizes = await this.quizzModel
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('reference')

        return await generate(quizes)
    }
}
