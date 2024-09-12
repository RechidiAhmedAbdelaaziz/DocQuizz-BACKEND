import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { DatabaseModule } from '@app/common';
import { Level, Course, Domain, Major } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Level }, { model: Major }, { model: Domain }, { model: Course }])
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule { }
