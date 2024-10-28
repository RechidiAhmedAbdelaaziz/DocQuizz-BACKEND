import { Controller } from '@nestjs/common';
import { ExamRecordService } from './exam-record.service';

@Controller('exam-record')
export class ExamRecordController {
  constructor(private readonly examRecordService: ExamRecordService) {}
}
