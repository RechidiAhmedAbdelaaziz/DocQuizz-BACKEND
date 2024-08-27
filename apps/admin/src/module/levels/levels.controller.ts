import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelBody } from './dto/create-level.dto';
import { AddMajorBody } from './dto/add-major.dto';
import { AddCourseBody } from './dto/add-course.dto';
import { CloudinaryService } from '@app/common/module/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StatisticService } from '../statistic/statistic.service';

@Controller('levels')
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService,
    private readonly cloudinary: CloudinaryService,
    private readonly statisticService: StatisticService
  ) { }

  @Post() //* LEVEL | Create ~ {{host}}/levels
  async createLevel(
    @Body() body: CreateLevelBody
  ) {
    const { name } = body

    await this.levelsService.checkLevelExists(name)

    return await this.levelsService.createLevel(name)
  }

  @Post('major') //* MAJOR | Add ~ {{host}}/levels/major
  @UseInterceptors(FileInterceptor('icon'))
  async addMajor(
    @Body() body: AddMajorBody,
    @UploadedFile() icon?: Express.Multer.File
  ) {
    const { name, level } = body

    const levelDoc = await this.levelsService.getLevel(level)
    this.levelsService.checkMajorExists(levelDoc, name)
    const iconUrl = icon ?
      await this.cloudinary.uploadImage(icon, `levels/${level}/${name}`)
      : undefined


    const major = await this.levelsService.addMajor(levelDoc, { name, iconUrl })

    await this.statisticService.updateStatistic({ newMajor: 1 })

    return major
  }

  @Post('course') //* COURSE | Add  ~ {{host}}/levels/course
  async addCourse(
    @Body() body: AddCourseBody
  ) {
    const { name: title, major, level, isFree } = body

    const levelDoc = await this.levelsService.getLevel(level)
    const majorIndex = this.levelsService.getMajorIndex(levelDoc, major)

    this.levelsService.checkCourseExists(levelDoc, majorIndex, title)

    return await this.levelsService.addCourse(levelDoc, majorIndex, { title, isFree })
  }
}
