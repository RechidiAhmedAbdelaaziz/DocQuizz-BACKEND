import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { HttpAuthGuard } from '@app/common';
import { query } from 'express';
import { ListMajorQuery } from './dto/list-major.dto';
import { ListCoursesQuery } from './dto/list-courses.dto';

@Controller('levels')
@UseGuards(HttpAuthGuard)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) { }

  @Get()  //* LEVELS | Get all ~ {{host}}/levels
  async getLevels() {
    return await this.levelsService.getLevels();
  }

  @Get('majors')  //* MAJOR | Get by level ~ {{host}}/levels/majors?level=...
  async getMajors(
    @Query() query: ListMajorQuery
  ) {
    const { level } = query;

    const levelEntity = await this.levelsService.getLevel(level);

    return this.levelsService.getMajors(levelEntity);
  }

  @Get('courses')  //* COURSES | Get by level and major ~ {{host}}/levels/courses?level=...&major=...
  async getCourses(
    @Query() query: ListCoursesQuery
  ) {
    const { level, major } = query;

    const levelEntity = await this.levelsService.getLevel(level);

    const majorIndex = this.levelsService.getMajorIndex(levelEntity, major);

    return this.levelsService.getCourses(levelEntity, majorIndex);
  }
}
