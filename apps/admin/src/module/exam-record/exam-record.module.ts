import { Module } from '@nestjs/common';
import { ExamRecordService } from './exam-record.service';
import { ExamRecordController } from './exam-record.controller';
import { DatabaseModule } from '@app/common';
import { ExamRecord } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: ExamRecord }]),
  ],
  controllers: [ExamRecordController],
  providers: [ExamRecordService],
  exports: [ExamRecordService]
})
export class ExamRecordModule {}
