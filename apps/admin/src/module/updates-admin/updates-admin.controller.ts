import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UpdatesAdminService } from './updates-admin.service';
import { CreateOrUpdateUpdateDto } from './dto/update.dto';
import { ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';

@Controller('updates')
export class UpdatesAdminController {
  constructor(private readonly updatesAdminService: UpdatesAdminService) {


  }


  @Post() //* UPDATES | Create ~ {{host}}/updates
  async createUpdate(
    @Body() data: CreateOrUpdateUpdateDto
  ) {
    return await this.updatesAdminService.createUpdate(data.title, data.description)
  }

  @Patch(':updateId') //* UPDATES | Update ~ {{host}}/updates/:updateId
  async updateUpdate(
    @Body() data: CreateOrUpdateUpdateDto,
    @Param('updateId', ParseMonogoIdPipe) updateId: Types.ObjectId,
  ) {
    const update = await this.updatesAdminService.getUpdateById(updateId)
    return await this.updatesAdminService.updateUpdate(update, data)
  }

  @Delete(':updateId') //* UPDATES | Delete ~ {{host}}/updates/:updateId
  async deleteUpdate(
    @Param('updateId', ParseMonogoIdPipe) updateId: Types.ObjectId,
  ) {
    const update = await this.updatesAdminService.getUpdateById(updateId)
    return await this.updatesAdminService.deleteUpdate(update)
  }


}
