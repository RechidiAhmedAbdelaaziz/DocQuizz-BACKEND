import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SourceService } from './source.service';
import { AdminGuard, HttpAuthGuard } from '@app/common';
import { CreateSourceBody, UpdateSourceBody, SourceIdParam } from './dto/source.dto';

@Controller('source')
@UseGuards(HttpAuthGuard)
export class SourceController {
  constructor(private readonly sourceService: SourceService) { }

  @Get() // * SOURCE | Get All ~ {{host}}/source
  async getSources() {
    return await this.sourceService.getSources();
  }
}


@Controller('source')
@UseGuards(AdminGuard)
export class AdminSourceController {
  constructor(private readonly sourceService: SourceService) { }

  @Post() // * SOURCE | Create ~ {{host}}/source
  async createSource(
    @Body() body: CreateSourceBody
  ) {
    const { title } = body;

    return await this.sourceService.createSource(title);
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

    return { message: 'Source deleted successfully' };
  }

}