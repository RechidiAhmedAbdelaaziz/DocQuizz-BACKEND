import { Level, Major, Domain, Course } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(Level.name) private readonly levelModel: Model<Level>,
        @InjectModel(Major.name) private readonly majorModel: Model<Major>,
        @InjectModel(Domain.name) private readonly domainModel: Model<Domain>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,

    ) { }

    getDomains = async () => {
        return await this.domainModel.find().sort('name')
    }

    getLevels = async (domain?: Domain) => {
        const filter = domain ? { domain } : {};
        return await this.levelModel.find(filter).sort('name');
    }

    getMajors = async (level?: Level, domain?: Domain) => {
        if (level) return await this.majorModel.find({ level }).sort('name');

        if (domain) return await this.majorModel
            .find({ level: { $in: await this.levelModel.find({ domain }) } })
            .sort('name');

        return await this.majorModel.find().sort('name');

    }

    getCourses = async (major?: Major) => {
        const filter = major ? { major } : {};
        return await this.courseModel.find(filter).sort('name');
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
