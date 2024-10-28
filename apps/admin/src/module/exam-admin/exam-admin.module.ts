import { Module } from '@nestjs/common';
import { ExamAdminService } from './exam-admin.service';
import { ExamAdminController } from './exam-admin.controller';
import { DatabaseModule } from '@app/common';
import { Exam } from '@app/common/models';
import { LevelsModule } from '../levels/levels.module';
import { ExamRecordModule } from '../exam-record/exam-record.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Exam }]),
    LevelsModule, ExamRecordModule
  ],
  controllers: [ExamAdminController],
  providers: [ExamAdminService],
  exports: [ExamAdminService]
})
export class ExamAdminModule { }
