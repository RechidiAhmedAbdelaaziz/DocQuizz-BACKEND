import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ExamAdminService } from './exam-admin.service';
import { CreateExamBody } from './dto/create-exam.dto';
import { ParseMonogoIdPipe, SkipAdminGuard } from '@app/common';
import { Types } from 'mongoose';
import { UpdateExamBody } from './dto/update-exam.dto';
import { StatisticService } from '../statistic/statistic.service';

@Controller('exam-admin')
export class ExamAdminController {
  constructor(private readonly examAdminService: ExamAdminService,
    private readonly statisticService: StatisticService

  ) { }

  @SkipAdminGuard()
  @Post() //* {"name":"EXAM | Create","request":{"method":"POST","header":[],"body":{"mode":"raw","raw":"{\n    \"major\": \"Math 2\",\n    \"time\": 1200, // secend\n    \"year\": 2022,\n    \"city\": \"El Bayadh\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/exam-admin","host":["{{host}}"],"path":["exam-admin"]}},"response":[]}
  async createExam(
    @Body() body: CreateExamBody
  ) {
    const { time, city, major, year } = body;
    const title = `Exam: ${major} | ${year} | ${city}`;

    await this.examAdminService.checkByName(title);

    const exam = await this.examAdminService.createExam({ time, city, major, year });

    await this.statisticService.updateStatistic({ newExam: 1 });

    return exam;
  }
  
  //* {"name":"EXAM | Update","request":{"method":"PATCH","header":[],"body":{"mode":"raw","raw":"{\n    \"major\": \"Math 2\",\n    \"time\": 1200, // secend\n    \"year\": 2022,\n    \"city\": \"El Bayadh\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/exam-admin/:id","host":["{{host}}"],"path":["exam-admin",":id"]}},"response":[]}
  @Patch(':id')
  async updateExam(
    @Body() body: UpdateExamBody,
    @Param('id', ParseMonogoIdPipe) id: Types.ObjectId
  ) {
    const { time, major, year, city } = body;

    const exam = await this.examAdminService.getExamById(id);
    const updatedExam = await this.examAdminService.updateExam(exam, { time, major, year, city });

    return updatedExam;
  }

  @Delete(':id')
  async deleteExam(
    @Param('id', ParseMonogoIdPipe) id: Types.ObjectId
  ) {
    const exam = await this.examAdminService.getExamById(id);
    await this.examAdminService.deleteExam(exam);

    await this.statisticService.updateStatistic({ newExam: -1 });

    return { message: 'Exam deleted successfully' };
  }
}
