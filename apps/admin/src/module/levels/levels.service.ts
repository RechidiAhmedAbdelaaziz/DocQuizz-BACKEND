import { Level } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(Level.name) private readonly levelModel: Model<Level>
    ) { }



    createLevel = async (name: string) => {
        const level = new this.levelModel()

        level.name = name;

        return await level.save()
    }

    addMajor = async (
        level: Level, options: { name: string, iconUrl?: string }
    ) => {
        const { name, iconUrl: icon } = options

        level.major.push({ name, icon, courses: [] })

        return await level.save()
    }

    addCourse = async (
        level: Level, majorIndex: number, course: { title: string, isFree: boolean }
    ) => {
        console.log(level.major[majorIndex])

        level.major[majorIndex].courses.push(course)

        console.log(level.major[0].courses)

        level.markModified('major')

        return await level.save()
    }

    async checkLevelExists(name: string) {
        const level = await this.levelModel.findOne({ name })
        if (level) throw new HttpException('Level already exists', 400)
    }

    async getLevel(name: string) {
        const level = await this.levelModel.findOne({ name }).select("+major")
        if (!level) throw new HttpException('Level not found', 404)

        return level
    }

    checkMajorExists(level: Level, name: string) {
        const major = level.major.find(major => major.name === name)
        if (major) throw new HttpException('Major already exists', 400)
    }

    getMajorIndex(level: Level, name: string) {
        const majorIndex = level.major.findIndex(major => major.name === name)
        if (majorIndex === -1) throw new HttpException('Major not found', 404)

        return majorIndex
    }

    checkCourseExists(level: Level, majorIndex: number, course: string) {
        const courseExists = level.major[majorIndex].courses.find(c => c.title === course)
        if (courseExists) throw new HttpException('Course already exists', 400)
    }



}
