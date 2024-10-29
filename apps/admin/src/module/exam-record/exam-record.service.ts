import { Domain, ExamRecord, Major } from '@app/common/models';
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
        domain?: Domain,
        type?: 'Résidanat' | 'Résidanat blanc',
        years: number[],
    }) {
        const { major, type, years, domain } = options;

        const checkExist = await this.examRecordModel.findOne({
            $or: [
                { major },
                { type, domain }
            ],
        });

        if (checkExist) {
            checkExist.years = years;
            checkExist.markModified('years');
            await checkExist.save();
            return;
        }

        await this.examRecordModel.create({
            major,
            domain,
            type,
            years,
        });


    }
}
