import { Body, Controller, Delete, Param, Patch, Post, } from '@nestjs/common';
import { LevelsService } from './levels.service';

import { CloudinaryService } from '@app/common/module/cloudinary/cloudinary.service';
import { StatisticService } from '../statistic/statistic.service';
import { NameBody, NameBodyWithIsOpen } from './dto/add-course.dto';
import { Types } from 'mongoose';
import { ParseMonogoIdPipe } from '@app/common';

@Controller()
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService,
    private readonly cloudinary: CloudinaryService,
    private readonly statisticService: StatisticService
  ) { }

  @Post('domains') // * DOMAIN | Create ~ {{host}}/domains
  async createDomain(@Body() body: NameBody) {
    const { name } = body

    const domain = await this.levelsService.createDomain(name)

    await this.statisticService.updateStatistic({ newDomain: 1 })

    return domain
  }
  @Patch('domains/:domainId')  // * DOMAIN | Update ~ {{host}}/domains/:domainId
  async updateDomain(
    @Body() body: NameBody,
    @Param('domainId', ParseMonogoIdPipe) domainId: Types.ObjectId,
  ) {
    const { name } = body

    const domain = await this.levelsService.getDomainById(domainId)

    return await this.levelsService.updateDomain(domain, name)
  }

  @Delete('domains/:domainId')  // * DOMAIN | Delete ~ {{host}}/domains/:domainId
  async deleteDomain(
    @Param('domainId', ParseMonogoIdPipe) domainId: Types.ObjectId,
  ) {
    const domain = await this.levelsService.getDomainById(domainId)

    await this.levelsService.deleteDomain(domain)

    await this.statisticService.updateStatistic({ newDomain: -1 })

    return { message: 'Domain deleted successfully' }
  }

  @Post('levels/:domainId')  // * LEVEL | Create ~ {{host}}/levels/:domainId
  async createLevel(
    @Body() body: NameBody,
    @Param('domainId', ParseMonogoIdPipe) domainId: Types.ObjectId,
  ) {
    const { name } = body

    const domain = await this.levelsService.getDomainById(domainId)

    const level = await this.levelsService.createLevel(name, domain)

    return level
  }

  @Patch('levels/:levelId')  // * LEVEL | Update ~ {{host}}/levels/:levelId
  async updateLevel(
    @Body() body: NameBody,
    @Param('levelId', ParseMonogoIdPipe) levelId: Types.ObjectId,
  ) {
    const { name } = body

    const level = await this.levelsService.getLevelById(levelId)

    return await this.levelsService.updateLevel(level, name)
  }

  @Delete('levels/:levelId')  // * LEVEL | Delete ~ {{host}}/levels/:levelId
  async deleteLevel(
    @Param('levelId', ParseMonogoIdPipe) levelId: Types.ObjectId,
  ) {
    const level = await this.levelsService.getLevelById(levelId)

    await this.levelsService.deleteLevel(level)

    return { message: 'Level deleted successfully' }
  }

  @Post('majors/:levelId')  // * MAJOR | Create ~ {{host}}/majors/:levelId
  async createMajor(
    @Body() body: NameBodyWithIsOpen,
    @Param('levelId', ParseMonogoIdPipe) levelId: Types.ObjectId,
  ) {
    const { name, isOpen } = body

    const level = await this.levelsService.getLevelById(levelId)

    const major = await this.levelsService.createMajor(name, level, isOpen)

    await this.statisticService.updateStatistic({ newMajor: 1 })

    return major
  }

  @Patch('majors/:majorId')  // * MAJOR | Update ~ {{host}}/majors/:majorId
  async updateMajor(
    @Body() body: NameBodyWithIsOpen,
    @Param('majorId', ParseMonogoIdPipe) majorId: Types.ObjectId,
  ) {
    const { name, isOpen } = body

    const major = await this.levelsService.getMajorById(majorId)

    return await this.levelsService.updateMajor(major, { name, isOpen })
  }

  @Delete('majors/:majorId')  // * MAJOR | Delete ~ {{host}}/majors/:majorId
  async deleteMajor(
    @Param('majorId', ParseMonogoIdPipe) majorId: Types.ObjectId,
  ) {
    const major = await this.levelsService.getMajorById(majorId)

    await this.levelsService.deleteMajor(major)

    await this.statisticService.updateStatistic({ newMajor: -1 })

    return { message: 'Major deleted successfully' }
  }

  @Post('courses/:majorId')  // * COURSE | Create ~ {{host}}/courses/:majorId
  async createCourse(
    @Body() body: NameBody,
    @Param('majorId', ParseMonogoIdPipe) majorId: Types.ObjectId,
  ) {
    const { name } = body

    const major = await this.levelsService.getMajorById(majorId)

    const course = await this.levelsService.createCourse(name, major)

    return course
  }

  @Patch('courses/:courseId')  // * COURSE | Update ~ {{host}}/courses/:courseId
  async updateCourse(
    @Body() body: NameBody,
    @Param('courseId', ParseMonogoIdPipe) courseId: Types.ObjectId,
  ) {
    const { name } = body

    const course = await this.levelsService.getCourseById(courseId)

    return await this.levelsService.updateCourse(course, name)
  }

  @Delete('courses/:courseId')  // * COURSE | Delete ~ {{host}}/courses/:courseId
  async deleteCourse(
    @Param('courseId', ParseMonogoIdPipe) courseId: Types.ObjectId,
  ) {
    const course = await this.levelsService.getCourseById(courseId)

    await this.levelsService.deleteCourse(course)

    return { message: 'Course deleted successfully' }
  }

}
