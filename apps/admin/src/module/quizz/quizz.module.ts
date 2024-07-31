import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { DatabaseModule } from '@app/common';
import { Quizz } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Quizz }])
  ],
  controllers: [QuizzController],
  providers: [QuizzService],
})
export class QuizzModule { }
