import { Module } from '@nestjs/common';
import { ExamRecordService } from './exam-record.service';
import { ExamRecordController } from './exam-record.controller';

@Module({
  controllers: [ExamRecordController],
  providers: [ExamRecordService],
})
export class ExamRecordModule {}
