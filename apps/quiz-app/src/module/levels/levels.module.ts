import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { DatabaseModule } from '@app/common';
import { Level } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Level }])
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule { }
