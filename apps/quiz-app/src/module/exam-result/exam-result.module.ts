import { Module } from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { ExamResultController } from './exam-result.controller';
import { DatabaseModule } from '@app/common';
import { ExamResult } from '@app/common/models';
import { UserModule } from '../user/user.module';
import { ExamModule } from '../exam/exam.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: ExamResult }]),
    UserModule,
    ExamModule,
  ],
  controllers: [ExamResultController],
  providers: [ExamResultService],
})
export class ExamResultModule { }
