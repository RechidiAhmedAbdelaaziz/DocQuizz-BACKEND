import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { DatabaseModule } from '@app/common';
import { Exam } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Exam }])
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService]
})
export class ExamModule { }
