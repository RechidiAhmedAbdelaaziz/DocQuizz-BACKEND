import { forwardRef, Module } from '@nestjs/common';
import { QuizRecordService } from './quiz-record.service';
import { QuizRecordController } from './quiz-record.controller';
import { DatabaseModule } from '@app/common';
import { QuizRecord } from '@app/common/models';
import { UserModule } from '../user/user.module';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: QuizRecord }]),
    UserModule, forwardRef(() => QuizModule),
  ],
  controllers: [QuizRecordController],
  providers: [QuizRecordService],
  exports: [QuizRecordService],
})
export class QuizRecordModule { }
