import { forwardRef, Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { DatabaseModule } from '@app/common';
import { Question } from '@app/common/models';
import { ExamModule } from '../exam/exam.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Question }]),
    forwardRef(() => ExamModule)
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule { }
