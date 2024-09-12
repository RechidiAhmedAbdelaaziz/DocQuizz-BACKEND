import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { DatabaseModule } from '@app/common';
import { Level, Domain, Course, Major } from '@app/common/models';
import { CloudinaryModule } from '@app/common/module/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Level }, { model: Domain }, { model: Major }, { model: Course }]),
    CloudinaryModule
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule { }
