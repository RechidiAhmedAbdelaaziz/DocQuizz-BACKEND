import { Module } from '@nestjs/common';
import { UpdatesAdminService } from './updates-admin.service';
import { UpdatesAdminController } from './updates-admin.controller';
import { DatabaseModule } from '@app/common';
import { Updates } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Updates }])
  ],
  controllers: [UpdatesAdminController],
  providers: [UpdatesAdminService],
})
export class UpdatesAdminModule { }
