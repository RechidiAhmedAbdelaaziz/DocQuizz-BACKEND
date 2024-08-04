import { Body, Controller, Post } from '@nestjs/common';
import { ExamAdminService } from './exam-admin.service';
import { CreateExamBody } from './dto/create-exam.dto';

@Controller('exam-admin')
export class ExamAdminController {
  constructor(private readonly examAdminService: ExamAdminService) { }

  @Post() //* EXAM | Create ~ {{host}}/exam-admin
  async createExam(
    @Body() body: CreateExamBody
  ) {
    return await this.examAdminService.createExam(body);
  }
}
