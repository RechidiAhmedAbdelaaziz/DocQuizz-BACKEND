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
        const { major, type, years: years_, domain } = options;

        // check if years contain null or undefined or NaN and put it in a new array without them 
        const years = []
        for (let i = 0; i < years_.length; i++) {
            if (years_[i] && years_[i] !== null && !isNaN(years_[i])) {
                years.push(years_[i])
            }
        }


        const checkExist = major ?
            await this.examRecordModel.findOne({ major }) :
            await this.examRecordModel.findOne({ domain, type });

        if (checkExist) {
            checkExist.years = years;
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
