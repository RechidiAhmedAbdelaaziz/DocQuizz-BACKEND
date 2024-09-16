import { Controller, Get, HttpException, Param, Query, UseGuards } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CurrentDomain, HttpAuthGuard } from '@app/common';
import { Types } from 'mongoose';
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
    const { levelId, domainId } = query;

    const level = levelId ? await this.levelsService.getLevelById(levelId) : undefined;
    const domain = domainId ? await this.levelsService.getDomainById(domainId) : undefined;

    return await this.levelsService.getMajors(level, domain);
  }

  @Get('majors/me') // * LEVELS | Get ~ {{host}}/levels/60f7b3b3b3b3b3b3b3b3
  async getMyMajors(@CurrentDomain() domainId?: Types.ObjectId) {
    if (!domainId) throw new HttpException('Select domain before', 400);
    
    const domain = await this.levelsService.getDomainById(domainId);

    return await this.levelsService.getMajors(undefined, domain);
  }



  @Get('courses') // * LEVELS | Get ~ {{host}}/levels/60f7b3b3b3b3b3b3b3b3b3
  async getCourses(@Query() query: ListCoursesQuery) {
    const { majorId } = query;

    const major = majorId ? await this.levelsService.getMajorById(majorId) : undefined;

    return await this.levelsService.getCourses(major);
  }






}

