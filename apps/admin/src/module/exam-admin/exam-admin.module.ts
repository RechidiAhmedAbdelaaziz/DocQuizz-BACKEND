import { Module } from '@nestjs/common';
import { ExamAdminService } from './exam-admin.service';
import { ExamAdminController } from './exam-admin.controller';
import { DatabaseModule } from '@app/common';
import { Exam } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Exam }])
  ],
  controllers: [ExamAdminController],
  providers: [ExamAdminService ],
  exports: [ExamAdminService]
})
export class ExamAdminModule { }
