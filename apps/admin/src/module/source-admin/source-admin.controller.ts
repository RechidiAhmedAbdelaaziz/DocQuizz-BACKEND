import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { SourceAdminService } from './source-admin.service';
import { CreateSourceBody, SourceIdParam, UpdateSourceBody } from './dto/source.dto';

@Controller('source')
export class SourceAdminController {
  constructor(private readonly sourceService: SourceAdminService) { }

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
