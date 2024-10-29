import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExamRecordService } from './exam-record.service';
import { LevelsService } from '../levels/levels.service';
import { GetYearsQuery } from './dto/get-years';
import { HttpAuthGuard } from '@app/common';

@Controller('exam-record')
export class ExamRecordController {
  constructor(private readonly examRecordService: ExamRecordService,
    private readonly levelsService: LevelsService,

  ) {
  }


  @UseGuards(HttpAuthGuard)
  @Get() //* EXAM-RECORD | Get years ~ {{host}}/exam-record
  async getYears(
    @Query() queries: GetYearsQuery
  ) {
    const { majorId, domain: domain_ } = queries;
    const { domainId, type } = domain_;



    const major = majorId ? await this.levelsService.getMajorById(majorId) : undefined;
    const domain = domainId ? await this.levelsService.getDomainById(domainId) : undefined;

    return await this.examRecordService.getExamRecord({ major, domain: { domain, type } });
  }
}
