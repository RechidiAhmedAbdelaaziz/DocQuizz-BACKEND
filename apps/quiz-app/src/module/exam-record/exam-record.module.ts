import { Module } from '@nestjs/common';
import { ExamRecordService } from './exam-record.service';
import { ExamRecordController } from './exam-record.controller';
import { DatabaseModule } from '@app/common';
import { ExamRecord } from '@app/common/models';
import { LevelsModule } from '../levels/levels.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: ExamRecord }]),
    LevelsModule
  ],
  controllers: [ExamRecordController],
  providers: [ExamRecordService],
})
export class ExamRecordModule { }
