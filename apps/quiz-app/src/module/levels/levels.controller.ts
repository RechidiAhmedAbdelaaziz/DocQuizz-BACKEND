import { Controller, Get, HttpException, Param, Query, UseGuards } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CurrentDomain, CurrentUser, HttpAuthGuard } from '@app/common';
import { Types } from 'mongoose';
import { ListCoursesQuery, ListLevelsQuery, ListMajorsQuery } from './dto/domains.dto';
import { UserService } from '../user/user.service';



@Controller('')
@UseGuards(HttpAuthGuard)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService,
    private readonly userService: UserService,
  ) { }


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
  async getMyMajors(
    @CurrentUser() userId: Types.ObjectId,
    @CurrentDomain() domainId?: Types.ObjectId,) {


    const domain = await this.levelsService.getDomainById(domainId ||
      (await this.userService.getUserById(userId)).domain.id
    )


    return await this.levelsService.getMajors(undefined, domain);
  }



  @Get('courses') // * LEVELS | Get ~ {{host}}/levels/60f7b3b3b3b3b3b3b3b3b3
  async getCourses(@Query() query: ListCoursesQuery, @CurrentUser() userId: Types.ObjectId) {
    const { majorId } = query;

    const major = majorId ? await this.levelsService.getMajorById(majorId) : undefined;

    return await this.levelsService.getCourses(major, userId);
  }






}

