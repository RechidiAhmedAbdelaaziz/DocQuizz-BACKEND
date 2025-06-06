import { Statistic } from '@app/common/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StatisticService {

    constructor(
        @InjectModel(Statistic.name) private readonly statisticModel: Model<Statistic>
    ) { }

    async getStatistics() {
        const statistic = await this.statisticModel.findOne()
        if (!statistic) return await this.updateStatistic({})
        return statistic
    }

    async updateStatistic(details: {
        newExam?: -1 | 1,
        newQuestion?: -1 | 1,
        newMajor?: -1 | 1,
        newUser?: -1 | 1,
        newSubscribedUser?: -1 | 1 | number,
        newSubscribtionRequest?: -1 | 1,
    }) {

        const statistic = await this.statisticModel.findOne() || new this.statisticModel()

        if (details.newExam) statistic.totalExam += details.newExam
        if (details.newQuestion) statistic.totalQuestion += details.newQuestion
        if (details.newMajor) statistic.totalMajor += details.newMajor
        if (details.newUser) statistic.totalUser += details.newUser
        if (details.newSubscribedUser) statistic.totalSubscribedUser += details.newSubscribedUser
        if (details.newSubscribtionRequest) statistic.totalSubscriptionRequest += details.newSubscribtionRequest
        
        return await statistic.save()

    }
}
