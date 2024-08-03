import { Module } from '@nestjs/common';
import { AcademicFieldService } from './academic-field.service';
import { AcademicFieldController } from './academic-field.controller';
import { DatabaseModule } from '@app/common';
import { AcademicField, Course } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: AcademicField }]),
  ],
  controllers: [AcademicFieldController],
  providers: [AcademicFieldService],
  exports: [AcademicFieldService],
})
export class AcademicFieldModule { }
