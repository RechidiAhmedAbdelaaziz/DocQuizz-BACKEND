import { Body, Controller, Delete, Param, Patch, Post, } from '@nestjs/common';
import { LevelsService } from './levels.service';

import { CloudinaryService } from '@app/common/module/cloudinary/cloudinary.service';
import { StatisticService } from '../statistic/statistic.service';
import { NameBody } from './dto/add-course.dto';
import { Types } from 'mongoose';
import { ParseMonogoIdPipe } from '@app/common';

@Controller()
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService,
    private readonly cloudinary: CloudinaryService,
    private readonly statisticService: StatisticService
  ) { }

  //* {"name":"DOMAIN | Create","request":{"method":"POST","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/domains","host":["{{host}}"],"path":["domains"]}},"response":[]}
  @Post('domains') 
  async createDomain(@Body() body: NameBody) {
    const { name } = body

    const domain = await this.levelsService.createDomain(name)

    await this.statisticService.updateStatistic({ newDomain: 1 })

    return domain
  }
 //* {"name":"DOMAIN | Update","request":{"method":"PATCH","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/domains/60f4b1b3b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["domains","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Patch('domains/:domainId') 
  async updateDomain(
    @Body() body: NameBody,
    @Param('domainId', ParseMonogoIdPipe) domainId: Types.ObjectId,
  ) {
    const { name } = body

    const domain = await this.levelsService.getDomainById(domainId)

    return await this.levelsService.updateDomain(domain, name)
  }


  //* {"name":"DOMAIN | Delete","request":{"method":"DELETE","header":[],"url":{"raw":"{{host}}/domains/60f4b1b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["domains","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Delete('domains/:domainId') 
  async deleteDomain(
    @Param('domainId', ParseMonogoIdPipe) domainId: Types.ObjectId,
  ) {
    const domain = await this.levelsService.getDomainById(domainId)

    await this.levelsService.deleteDomain(domain)

    await this.statisticService.updateStatistic({ newDomain: -1 })

    return { message: 'Domain deleted successfully' }
  }

  // {"name":"LEVEL | Create","request":{"method":"POST","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\",\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/levels/60f4b1b3b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["levels","60f4b1b3b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Post('levels/:domainId') 
  async createLevel(
    @Body() body: NameBody,
    @Param('domainId', ParseMonogoIdPipe) domainId: Types.ObjectId,
  ) {
    const { name } = body

    const domain = await this.levelsService.getDomainById(domainId)

    const level = await this.levelsService.createLevel(name, domain)

    return level
  }

  // {"name":"LEVEL | Update","request":{"method":"PATCH","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/levels/60f4b1b3b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["levels","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Patch('levels/:levelId') 
  async updateLevel(
    @Body() body: NameBody,
    @Param('levelId', ParseMonogoIdPipe) levelId: Types.ObjectId,
  ) {
    const { name } = body

    const level = await this.levelsService.getLevelById(levelId)

    return await this.levelsService.updateLevel(level, name)
  }

  // {"name":"LEVEL | Delete","request":{"method":"DELETE","header":[],"url":{"raw":"{{host}}/levels/60f4b1b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["levels","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Delete('levels/:levelId') 
  async deleteLevel(
    @Param('levelId', ParseMonogoIdPipe) levelId: Types.ObjectId,
  ) {
    const level = await this.levelsService.getLevelById(levelId)

    await this.levelsService.deleteLevel(level)

    return { message: 'Level deleted successfully' }
  }

  // {"name":"MAJOR | Create","request":{"method":"POST","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/majors/60f4b1b3b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["majors","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Post('majors/:levelId') 
  async createMajor(
    @Body() body: NameBody,
    @Param('levelId', ParseMonogoIdPipe) levelId: Types.ObjectId,
  ) {
    const { name } = body

    const level = await this.levelsService.getLevelById(levelId)

    const major = await this.levelsService.createMajor(name, level)

    await this.statisticService.updateStatistic({ newMajor: 1 })

    return major
  }

  // {"name":"MAJOR | Update","request":{"method":"PATCH","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/majors/60f4b1b3b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["majors","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Patch('majors/:majorId') 
  async updateMajor(
    @Body() body: NameBody,
    @Param('majorId', ParseMonogoIdPipe) majorId: Types.ObjectId,
  ) {
    const { name } = body

    const major = await this.levelsService.getMajorById(majorId)

    return await this.levelsService.updateMajor(major, name)
  }

  // {"name":"MAJOR | Delete","request":{"method":"DELETE","header":[],"url":{"raw":"{{host}}/majors/60f4b1b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["majors","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Delete('majors/:majorId') 
  async deleteMajor(
    @Param('majorId', ParseMonogoIdPipe) majorId: Types.ObjectId,
  ) {
    const major = await this.levelsService.getMajorById(majorId)

    await this.levelsService.deleteMajor(major)

    await this.statisticService.updateStatistic({ newMajor: -1 })

    return { message: 'Major deleted successfully' }
  }

  // {"name":"COURSE | Create","request":{"method":"POST","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/courses/60f4b1b3b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["courses","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]}
  @Post('courses/:majorId') 
  async createCourse(
    @Body() body: NameBody,
    @Param('majorId', ParseMonogoIdPipe) majorId: Types.ObjectId,
  ) {
    const { name } = body

    const major = await this.levelsService.getMajorById(majorId)

    const course = await this.levelsService.createCourse(name, major)

    return course
  }

  // {"name":"COURSE | Update","request":{"method":"PATCH","header":[],"body":{"mode":"raw","raw":"{\n    \"name\": \"Math\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/courses/60f4b1b3b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["courses","60f4b1b3b3b3b3b3b3b3b3"]}}
  @Patch('courses/:courseId') 
  async updateCourse(
    @Body() body: NameBody,
    @Param('courseId', ParseMonogoIdPipe) courseId: Types.ObjectId,
  ) {
    const { name } = body

    const course = await this.levelsService.getCourseById(courseId)

    return await this.levelsService.updateCourse(course, name)
  }

  // {"name":"COURSE | Delete","request":{"method":"DELETE","header":[],"url":{"raw":"{{host}}/courses/60f4b1b3b3b3b3b3b3b3b3","host":["{{host}}"],"path":["courses","60f4b1b3b3b3b3b3b3b3b3"]}},"response":[]
  @Delete('courses/:courseId') 
  async deleteCourse(
    @Param('courseId', ParseMonogoIdPipe) courseId: Types.ObjectId,
  ) {
    const course = await this.levelsService.getCourseById(courseId)

    await this.levelsService.deleteCourse(course)

    return { message: 'Course deleted successfully' }
  }

}
