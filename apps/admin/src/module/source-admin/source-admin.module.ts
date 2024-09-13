import { Module } from '@nestjs/common';
import { SourceAdminService } from './source-admin.service';
import { SourceAdminController } from './source-admin.controller';
import { DatabaseModule } from '@app/common';
import { Source } from '@app/common/models';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Source }]), StatisticModule
  ],
  controllers: [SourceAdminController],
  providers: [SourceAdminService],
  exports: [SourceAdminService],
})
export class SourceAdminModule { }
