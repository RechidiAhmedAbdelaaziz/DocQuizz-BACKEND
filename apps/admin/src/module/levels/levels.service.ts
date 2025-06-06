import { Level, Domain, Major, Course } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel(Domain.name) private readonly domainModel: Model<Domain>,
        @InjectModel(Level.name) private readonly levelModel: Model<Level>,
        @InjectModel(Major.name) private readonly majorModel: Model<Major>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,

    ) { }
    createDomain = async (name: string) => {
        const domain = new this.domainModel({ name })
        return domain.save()
    }

    createLevel = async (name: string, domain: Domain) => {
        const level = new this.levelModel({ name, domain })
        return level.save()
    }

    createMajor = async (name: string, level: Level) => {
        const major = new this.majorModel({ name, level })
        return major.save()
    }

    createCourse = async (name: string, major: Major, isOpen?: boolean,) => {
        const course = new this.courseModel({ name, major, isOpen })
        return course.save()
    }

    updateDomain = async (domain: Domain, name: string) => {
        domain.name = name
        return domain.save()
    }

    updateLevel = async (level: Level, name: string) => {
        level.name = name
        return level.save()
    }

    updateMajor = async (major: Major, options: {
        name?: string,

        addExam?: boolean,
        deleteExam?: boolean
    }) => {
        if (options.name) major.name = options.name
        if (options.addExam) major.nbExams++
        if (options.deleteExam) major.nbExams--

        return major.save()
    }

    updateCourse = async (course: Course, name: string, isOpen?: boolean,) => {
        course.name = name
        if (isOpen !== undefined) course.isOpen = isOpen
        return course.save()
    }

    deleteDomain = async (domain: Domain) => {
        await domain.deleteOne()
    }

    deleteLevel = async (level: Level) => {
        await level.deleteOne()
    }

    deleteMajor = async (major: Major) => {
        await major.deleteOne()
    }

    deleteCourse = async (course: Course) => {
        await course.deleteOne()
    }

    async getDomainById(id: Types.ObjectId) {
        const domain = await this.domainModel.findById(id)
        if (!domain) throw new HttpException('Domain not found', 404)
        return domain
    }

    async getLevelById(id: Types.ObjectId) {
        const level = await this.levelModel.findById(id)
        if (!level) throw new HttpException('Level not found', 404)
        return level
    }

    async getMajorById(id: Types.ObjectId) {
        const major = await this.majorModel.findById(id)
        if (!major) throw new HttpException('Major not found', 404)
        return major
    }

    async getCourseById(id: Types.ObjectId) {
        const course = await this.courseModel.findById(id)
        if (!course) throw new HttpException('Course not found', 404)
        return course
    }







}
