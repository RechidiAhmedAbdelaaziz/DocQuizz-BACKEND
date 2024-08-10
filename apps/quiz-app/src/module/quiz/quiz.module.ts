import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { DatabaseModule } from '@app/common';
import { Quiz } from '@app/common/models/quiz.model';
import { QuestionModule } from '../question/question.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Quiz }]),
    QuestionModule, UserModule
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule { }
