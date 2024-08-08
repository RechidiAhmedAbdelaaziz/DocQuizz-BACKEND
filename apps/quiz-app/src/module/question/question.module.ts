import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { DatabaseModule } from '@app/common';
import { Question } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Question }])
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule { }
