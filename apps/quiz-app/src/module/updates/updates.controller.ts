import { Controller, Get } from '@nestjs/common';
import { UpdatesService } from './updates.service';

@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) { }

  @Get() //* UPDATES | Get ~ {{host}}/updates
  async getUpdates() {
    return await this.updatesService.getUpdates()
  }
}
