import { Level, Major, Domain, Course } from '@app/common/models';
import { HttpException, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(Level.name) private readonly levelModel: Model<Level>,
        @InjectModel(Major.name) private readonly majorModel: Model<Major>,
        @InjectModel(Domain.name) private readonly domainModel: Model<Domain>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
        private readonly subscriptionService: SubscriptionService
    ) { }

    getDomains = async () => {
        return await this.domainModel.find()
            .sort('name')
    }

    getLevels = async (domain?: Domain) => {
        const filter = domain ? { domain } : {};
        return await this.levelModel.find(filter)
    }

    getMajors = async (level?: Level, domain?: Domain, userId?: Types.ObjectId) => {
        const filter: FilterQuery<Major> = {};


        if (domain) filter.level = { $in: await this.levelModel.find({ domain }) }
        if (level) filter.level = level



        const majors = await this.majorModel.find(filter).sort('name')

        const levels = (await this.subscriptionService.getSubscriptions({ user: userId }, {}))
            .data.map((sub) => sub.offer.levels)
            .flatMap((level) => level.map((l) => l._id))


        console.log("PAIS LEVELS >>> ", levels)

        // if major's level in levels , make mojor.isOpen = true
        for (const major of majors) {
            const isOpen = levels.some((level) => level.toString() === major.level.toString());
            console.log("MAJOR >>> ", major.isOpen)
            major.isOpen = isOpen;
            console.log("MAJOR >>> ", major.isOpen)
            console.log("===========================================")
        }


        return majors


    }

    getCourses = async (major?: Major) => {
        const filter = major ? { major } : {};
        return await this.courseModel.find(filter)
            .sort('name')

    }

    getDomainById = async (id: Types.ObjectId) => {
        const domain = await this.domainModel.findById(id);
        if (!domain) throw new HttpException('Domain not found', 404);
        return domain;
    }

    getLevelById = async (id: Types.ObjectId) => {
        const level = await this.levelModel.findById(id);
        if (!level) throw new HttpException('Level not found', 404);
        return level;
    }

    getMajorById = async (id: Types.ObjectId) => {
        const major = await this.majorModel.findById(id);
        if (!major) throw new HttpException('Major not found', 404);
        return major;
    }









}
