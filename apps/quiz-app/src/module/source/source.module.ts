import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import {  SourceController } from './source.controller';
import { DatabaseModule } from '@app/common';
import { Source } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Source }])
  ],
  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule { }
