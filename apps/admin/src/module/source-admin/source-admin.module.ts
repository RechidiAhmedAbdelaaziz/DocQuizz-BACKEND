import { Module } from '@nestjs/common';
import { SourceAdminService } from './source-admin.service';
import { SourceAdminController } from './source-admin.controller';
import { DatabaseModule } from '@app/common';
import { Source } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Source }]),
  ],
  controllers: [SourceAdminController],
  providers: [SourceAdminService],
  exports: [SourceAdminService],
})
export class SourceAdminModule { }
