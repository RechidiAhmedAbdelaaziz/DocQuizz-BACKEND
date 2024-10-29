import { Domain, ExamRecord, Major } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExamRecordService {

    constructor(
        @InjectModel(ExamRecord.name) private readonly examRecordModel: Model<ExamRecord>
    ) { }

    async getExamRecord(options: {
        major?: Major,
        domain?: {
            domain: Domain,
            type: "Résidanat" | "Résidanat blanc"

        }
    }) {
        const { major, domain: domain_ } = options;
        const { domain, type } = domain_;

        return (
            major
                ? await this.examRecordModel.find({ major })
                : await this.examRecordModel.find({ domain, type })
        ) || { years: [] }
    }
}
