import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { SourceAdminService } from './source-admin.service';
import { CreateSourceBody, SourceIdParam, UpdateSourceBody } from './dto/source.dto';
import { StatisticService } from '../statistic/statistic.service';
import { SkipAdminGuard } from '@app/common';

@Controller('source')
export class SourceAdminController {
  constructor(private readonly sourceService: SourceAdminService,
    private readonly statisticService: StatisticService,

  ) { }

  @SkipAdminGuard()
  @Post() // * SOURCE | Create ~ {{host}}/source
  async createSource(
    @Body() body: CreateSourceBody
  ) {
    const { title } = body;

    const source = await this.sourceService.createSource(title);

    await this.statisticService.updateStatistic({ newSource: 1 });

    return source;
  }

  @Patch(':sourceId') // * SOURCE | Update ~ {{host}}/source/:sourceId
  async updateSource(
    @Body() body: UpdateSourceBody,
    @Param() params: SourceIdParam,
  ) {
    const { title } = body;
    const { sourceId } = params;

    const source = await this.sourceService.getSourceById(sourceId);

    return await this.sourceService.updateSource(source, title);
  }

  @Delete(':sourceId') // * SOURCE | Delete ~ {{host}}/source/:sourceId
  async deleteSource(
    @Param() params: SourceIdParam
  ) {
    const { sourceId } = params;

    const source = await this.sourceService.getSourceById(sourceId);

    await this.sourceService.deleteSource(source);
    await this.statisticService.updateStatistic({ newSource: -1 });

    return { message: 'Source deleted successfully' };
  }
}
