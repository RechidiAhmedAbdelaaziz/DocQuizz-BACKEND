import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { query } from 'express';
import { ListCoursesQuery, ListLevelsQuery, ListMajorsQuery } from './dto/domains.dto';



@Controller('')
@UseGuards(HttpAuthGuard)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) { }


  @Get('domains') // * DOMAINS | List ~ {{host}}/domains
  async getDomains() {
    return await this.levelsService.getDomains();
  }

  @Get('levels')  // * LEVELS | List ~ {{host}}/levels?domainId=60f7b3b3b3b3b3b3b3b3b3b3
  async getLevels(@Query() query: ListLevelsQuery) {
    const { domainId } = query;

    const domain = domainId ? await this.levelsService.getDomainById(domainId) : undefined;

    return await this.levelsService.getLevels(domain);
  }

  @Get('majors') // * LEVELS | Get ~ {{host}}/levels/60f7b3b3b3b3b3b3b3b3
  async getMajors(@Query() query: ListMajorsQuery) {
    const { levelId } = query;

    const level = levelId ? await this.levelsService.getLevelById(levelId) : undefined;

    return await this.levelsService.getMajors(level);
  }

  @Get('courses') // * LEVELS | Get ~ {{host}}/levels/60f7b3b3b3b3b3b3b3b3b3
  async getCourses(@Query() query: ListCoursesQuery) {
    const { majorId } = query;

    const major = majorId ? await this.levelsService.getMajorById(majorId) : undefined;

    return await this.levelsService.getCourses(major);
  }

  




}

