import { Level } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(Level.name) private readonly levelModel: Model<Level>
    ) { }

    getLevels = async () => {
        return await this.levelModel.find()
    }

    getMajors = (level: Level) => {
        const majors = level.major.map(major => major.name)
        return majors
    }

    getCourses = (level: Level, majorIndex: number) => {
        const courses = level.major[majorIndex].courses
        return courses
    }

    async getLevel(name: string) {
        const level = await this.levelModel.findOne({ name }).select("+major")
        if (!level) throw new HttpException('Level not found', 404)

        return level
    }


    getMajorIndex(level: Level, name: string) {
        const majorIndex = level.major.findIndex(major => major.name === name)
        if (majorIndex === -1) throw new HttpException('Major not found', 404)

        return majorIndex
    }


}
