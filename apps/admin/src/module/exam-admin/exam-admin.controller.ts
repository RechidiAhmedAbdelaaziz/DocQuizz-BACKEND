import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ExamAdminService } from './exam-admin.service';
import { CreateExamBody } from './dto/create-exam.dto';
import { ParseMonogoIdPipe, SkipAdminGuard } from '@app/common';
import { Types } from 'mongoose';
import { UpdateExamBody } from './dto/update-exam.dto';
import { StatisticService } from '../statistic/statistic.service';
import { LevelsService } from '../levels/levels.service';
import { ExamRecordService } from '../exam-record/exam-record.service';

@Controller('exam-admin')
export class ExamAdminController {
  constructor(private readonly examAdminService: ExamAdminService,
    private readonly statisticService: StatisticService,
    private readonly majorService: LevelsService,
    private readonly examRecordService: ExamRecordService

  ) { }

  @SkipAdminGuard()
  @Post() //* {"name":"EXAM | Create","request":{"method":"POST","header":[],"body":{"mode":"raw","raw":"{\n    \"major\": \"Math 2\",\n    \"time\": 1200, // secend\n    \"year\": 2022,\n    \"city\": \"El Bayadh\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/exam-admin","host":["{{host}}"],"path":["exam-admin"]}},"response":[]}
  async createExam(
    @Body() body: CreateExamBody
  ) {
    const { time, city, majorId, year, group, type: type_ } = body;

    const type = type_.trim();

    const major = majorId ? await this.majorService.getMajorById(majorId) : undefined


    const exam = await this.examAdminService.createExam({ time, city, major, year, type, group });


    if (type === 'Résidanat' || type === 'Résidanat blanc') {
      await this.examRecordService.addExamRecord({ type, year });
    }
    else {
      await this.examRecordService.addExamRecord({ major, year });
    }

    if (major) await this.majorService.updateMajor(major, { addExam: true });

    await this.statisticService.updateStatistic({ newExam: 1 });

    return exam;
  }

  //* {"name":"EXAM | Update","request":{"method":"PATCH","header":[],"body":{"mode":"raw","raw":"{\n    \"major\": \"Math 2\",\n    \"time\": 1200, // secend\n    \"year\": 2022,\n    \"city\": \"El Bayadh\"\n}","options":{"raw":{"language":"json"}}},"url":{"raw":"{{host}}/exam-admin/:id","host":["{{host}}"],"path":["exam-admin",":id"]}},"response":[]}
  @Patch(':id')
  async updateExam(
    @Body() body: CreateExamBody,
    @Param('id', ParseMonogoIdPipe) id: Types.ObjectId
  ) {
    const { time, city, majorId, year, group, type: type_ } = body;

    // type can contain a space at the end
    const type = type_.trim();

    const major = majorId ? await this.majorService.getMajorById(majorId) : undefined

    const exam = await this.examAdminService.getExamById(id);

    await this.examAdminService.updateExam(exam, { time, city, major, year, type, group });

    return exam;
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
