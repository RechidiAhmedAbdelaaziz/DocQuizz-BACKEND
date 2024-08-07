import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { DatabaseModule } from '@app/common';
import { Question } from '@app/common/models/question.model';
import { ExamAdminModule } from '../exam-admin/exam-admin.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Question }]),
    ExamAdminModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule { }
