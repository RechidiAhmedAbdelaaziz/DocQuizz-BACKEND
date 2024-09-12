import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';

@Controller('')
@UseGuards(HttpAuthGuard)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) { }

  
  @Get('domains') // * DOMAINS | List ~ {{host}}/domains
  async getDomains() {
    return await this.levelsService.getDomains();
  }

  @Get('levels')  // * LEVELS | List ~ {{host}}/levels?domainId=60f7b3b3b3b3b3b3b3b3b3b3
  async getLevels(@Query('domainId', ParseMonogoIdPipe) domainId?: Types.ObjectId) {

    const domain = domainId ? await this.levelsService.getDomainById(domainId) : undefined;

    return await this.levelsService.getLevels(domain);
  }

  @Get('majors') // * MAJORS | List ~ {{host}}/majors?levelId=60f7b3b3b3b3b3b3b3b3b3
  async getMajors(@Query('levelId', ParseMonogoIdPipe) levelId?: Types.ObjectId) {

    const level = levelId ? await this.levelsService.getLevelById(levelId) : undefined;

    return await this.levelsService.getMajors(level);
  }

  @Get('courses') // * COURSES | List ~ {{host}}/courses?majorId=60f7b3b3b3b3b3b3b3b3b3
  async getCourses(@Query('majorId', ParseMonogoIdPipe) majorId?: Types.ObjectId) {

    const major = majorId ? await this.levelsService.getMajorById(majorId) : undefined;

    return await this.levelsService.getCourses(major);
  }




}
