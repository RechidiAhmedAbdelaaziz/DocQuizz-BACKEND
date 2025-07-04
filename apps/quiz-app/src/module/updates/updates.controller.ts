import { Controller, Get, UseGuards } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { HttpAuthGuard } from '@app/common';

@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) { }

  @UseGuards(HttpAuthGuard)
  @Get() //* UPDATES | Get ~ {{host}}/updates
  async getUpdates() {
    return await this.updatesService.getUpdates()
  }



  @UseGuards(HttpAuthGuard)
  @Get('last') //* UPDATES | Get last update date ~ {{host}}/updates/last
  async getLastUpdateDate() {
    return {
      data: { 'date': await this.updatesService.getLastUpdateDate() }
    }
  }
}
