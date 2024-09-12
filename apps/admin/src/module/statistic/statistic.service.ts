import { Statistic } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StatisticService {

    constructor(
        @InjectModel(Statistic.name) private readonly statisticModel: Model<Statistic>
    ) { }

    async updateStatistic(details: {
        newExam?: -1 | 1,
        newQuestion?: -1 | 1,
        newMajor?: -1 | 1,
        newDomain?: -1 | 1,

    }) {

        const statistic = await this.statisticModel.findOne() || new this.statisticModel()

        if (details.newExam) statistic.totalExam += details.newExam
        if (details.newQuestion) statistic.totalQuestion += details.newQuestion
        if (details.newMajor) statistic.totalMajor += details.newMajor
        if (details.newDomain) statistic.totalDomain += details.newDomain

        return await statistic.save()

    }
}
