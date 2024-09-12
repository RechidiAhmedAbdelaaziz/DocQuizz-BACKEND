import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { AdminSourceController, SourceController } from './source.controller';
import { DatabaseModule } from '@app/common';
import { Source } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Source }])
  ],
  controllers: [SourceController, AdminSourceController],
  providers: [SourceService],
})
export class SourceModule { }
