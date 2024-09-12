import { QuizRecord, User } from '@app/common/models';
import { Quiz } from '@app/common/models/quiz.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QuizRecordService {

    constructor(
        @InjectModel(QuizRecord.name) private readonly sourceModel: Model<QuizRecord>,
    ) { }

    getRecordsNumber = async (user: User) => await this.sourceModel.countDocuments({ user })

    createRecord = async (user: User, quiz: Quiz) => {

        await this.sourceModel.findOneAndUpdate({ user, quiz });


        const date = new Date();
        const endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

        const record = new this.sourceModel();

        record.user = user;
        record.quiz = quiz;
        record.expirationDate = endDay;

        return await record.save();
    }
}
