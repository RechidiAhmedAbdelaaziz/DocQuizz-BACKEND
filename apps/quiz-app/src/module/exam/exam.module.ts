import { forwardRef, Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { DatabaseModule } from '@app/common';
import { Exam } from '@app/common/models';
import { QuestionModule } from '../question/question.module';
import { LevelsModule } from '../levels/levels.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Exam }]),
    forwardRef(() => QuestionModule),
    LevelsModule,
    SubscriptionModule,
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService]
})
export class ExamModule { }
