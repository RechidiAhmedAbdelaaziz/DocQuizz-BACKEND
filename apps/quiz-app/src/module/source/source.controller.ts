import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { SourceService } from './source.service';
import {  HttpAuthGuard } from '@app/common';

@Controller('source')
@UseGuards(HttpAuthGuard)
export class SourceController {
  constructor(private readonly sourceService: SourceService) { }

  @Get() // * SOURCE | Get All ~ {{host}}/source
  async getSources() {
    return await this.sourceService.getSources();
  }
}


