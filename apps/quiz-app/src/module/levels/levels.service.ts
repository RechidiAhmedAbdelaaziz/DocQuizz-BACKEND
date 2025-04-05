import { Level, Major, Domain, Course } from '@app/common/models';
import { HttpException, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(Level.name) private readonly levelModel: Model<Level>,
        @InjectModel(Major.name) private readonly majorModel: Model<Major>,
        @InjectModel(Domain.name) private readonly domainModel: Model<Domain>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    ) { }

    getDomains = async () => {
        return await this.domainModel.find()
            .sort('name')
    }

    getLevels = async (domain?: Domain) => {
        const filter = domain ? { domain } : {};
        return await this.levelModel.find(filter)
    }

    getMajors = async (level?: Level, domain?: Domain, paidLevels?: Types.ObjectId[]) => {
        const filter: FilterQuery<Major> = {};


        if (domain) filter.level = { $in: await this.levelModel.find({ domain }) }
        if (level) filter.level = level



        const majors = await this.majorModel.find(filter).sort('name')

        console.log("PAIS LEVELS >>> ", paidLevels)

        if (paidLevels && paidLevels.length > 0) {

            for (const major of majors) {
                if (paidLevels.some((paidLevel) => paidLevel.toString() === major.level.toString())) {
                    major.isOpen = true
                }
            }

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
