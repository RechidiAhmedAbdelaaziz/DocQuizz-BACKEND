import { Module } from '@nestjs/common';
import { AcademicFieldService } from './academic-field.service';
import { AcademicFieldController } from './academic-field.controller';
import { DatabaseModule } from '@app/common';
import { CloudinaryModule } from '@app/common/module/cloudinary/cloudinary.module';
import { AcademicField } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: AcademicField }]),
    CloudinaryModule
  ],
  controllers: [AcademicFieldController],
  providers: [AcademicFieldService],
  exports: [AcademicFieldService]
})
export class AcademicFieldModule { }
