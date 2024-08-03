import { Controller, Get, Query } from '@nestjs/common';
import { AcademicFieldService } from './academic-field.service';
import { ListFieldsQuery } from './dto/list-fields.dto';

@Controller('academic-field')
export class AcademicFieldController {
  constructor(private readonly academicFieldService: AcademicFieldService) {}

  @Get() //* FIELDS | Get All  {{host}}/academic-field
  async getAcademicFields(
    @Query() query: ListFieldsQuery
  ) {
    const { name, years, limit, page } = query;
    return await this.academicFieldService.getAcademicFields({ name, years }, { limit, page });
  }
}
