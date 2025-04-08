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

    getMajors = async (level?: Level, domain?: Domain,) => {
        const filter: FilterQuery<Major> = {};


        if (domain) filter.level = { $in: await this.levelModel.find({ domain }) }
        if (level) filter.level = level



        const majors = await this.majorModel.find(filter).sort('name')


        return majors


    }

    getCourses = async (major?: Major, userId?: Types.ObjectId) => {
        const subs = (await this.subscriptionService.getSubscriptions({ user: userId }, {}))


        const levels = subs.data.map((sub) => sub.offer.levels)
            .flatMap((level) => level.map((l) => l._id))

        const matchStage = major ? { major: new Types.ObjectId(major._id) } : {};


        const courses = await this.courseModel.aggregate([
            { $match: matchStage },

            // Join with Major
            {
                $lookup: {
                    from: 'majors', // collection name (usually lowercase plural)
                    localField: 'major',
                    foreignField: '_id',
                    as: 'major',
                }
            },
            { $unwind: '$major' },

            // Join with Level
            {
                $lookup: {
                    from: 'levels',
                    localField: 'major.level',
                    foreignField: '_id',
                    as: 'major.level',
                }
            },
            { $unwind: '$major.level' },

            // Add isLevelMatched field
            {
                $addFields: {
                    isLevelMatched: { $in: ['$major.level._id', levels] }
                }
            },

            // Conditionally override isOpen
            {
                $addFields: {
                    isOpen: {
                        $cond: {
                            if: '$isLevelMatched',
                            then: true,
                            else: '$isOpen'
                        }
                    }
                }
            },

            // Remove helper field
            { $project: { isLevelMatched: 0 } }
        ]);

        return courses;

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
