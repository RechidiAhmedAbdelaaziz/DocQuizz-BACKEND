import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ExamAdminService } from './exam-admin.service';
import { CreateExamBody } from './dto/create-exam.dto';
import { ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { UpdateExamBody } from './dto/update-exam.dto';

@Controller('exam-admin')
export class ExamAdminController {
  constructor(private readonly examAdminService: ExamAdminService) { }

  @Post() //* EXAM | Create ~ {{host}}/exam-admin
  async createExam(
    @Body() body: CreateExamBody
  ) {
    const { time, city, major, year } = body;
    const title = `Exam: ${major} | ${year} | ${city}`;

    await this.examAdminService.checkByName(title);

    const exam = await this.examAdminService.createExam({ time, city, major, year });

    return exam;
  }

  @Patch(':id') //* EXAM | Update ~ {{host}}/exam-admin/:id
  async updateExam(
    @Body() body: UpdateExamBody,
    @Param('id', ParseMonogoIdPipe) id: Types.ObjectId
  ) {
    const { time, major, year, city } = body;

    const exam = await this.examAdminService.getExamById(id);
    const updatedExam = await this.examAdminService.updateExam(exam, { time, major, year, city });

    return updatedExam;
  }
}
