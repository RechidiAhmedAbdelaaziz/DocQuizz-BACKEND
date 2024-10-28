import { ExamRecord, Major } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExamRecordService {
    constructor(
        @InjectModel(ExamRecord.name) private readonly examRecordModel: Model<ExamRecord>
    ) { }

    async addExamRecord(options: {
        major?: Major,
        type?: 'Résidanat' | 'Résidanat blanc',
        year: number,
    }) {
        const { major, type, year } = options;

        const checkExist = await this.examRecordModel.findOne({
            $or: [
                { major: major },
                { type: type }
            ],
        });

        if (checkExist) {
            if (!checkExist.years.includes(year)) {
                checkExist.years.push(year);
                await checkExist.save();
            }
            return;
        }

        await this.examRecordModel.create({
            major: major,
            type: type,
            years: [year]
        });





    }
}
