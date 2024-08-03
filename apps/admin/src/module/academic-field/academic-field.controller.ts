import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AcademicFieldService } from './academic-field.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFieldBody } from './dto/create-field.dto';
import { CloudinaryService } from '@app/common/module/cloudinary/cloudinary.service';
import { Types } from 'mongoose';
import { ParseMonogoIdPipe } from '@app/common';
import { UpdateFieldBody } from './dto/update-field.dto';

@Controller('academic-field')
export class AcademicFieldController {
  constructor(
    private readonly academicFieldService: AcademicFieldService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post() //* FIELDS | Create  {{host}}/academic-field
  @UseInterceptors(FileInterceptor('icon'))
  async createAcademicField(
    @Body() data: CreateFieldBody,
    @UploadedFile() icon?: Express.Multer.File,
  ) {
    const { year, semester, name } = data;

    const iconName = `field-${name}-icon`;
    const iconUrl = icon ?
      await this.cloudinaryService.uploadImage(icon, iconName)
      : undefined

    return await this.academicFieldService.createAcademicField({
      year,
      semester,
      name,
      icon: iconUrl
    });
  }

  @Patch(':fieldId') //* FIELDS | Update  {{host}}/academic-field/:fieldId
  @UseInterceptors(FileInterceptor('icon'))
  async updateAcademicField(
    @Param('fieldId', ParseMonogoIdPipe) fieldId: Types.ObjectId,
    @Body() data: UpdateFieldBody,
    @UploadedFile() icon?: Express.Multer.File,
  ) {
    const { year, semester, name } = data;

    const iconName = `field-${name}-icon`;
    const iconUrl = icon ? await this.cloudinaryService.uploadImage(icon, iconName) : undefined;

    const field = await this.academicFieldService.getAcademicFieldById(fieldId);

    return await this.academicFieldService.updateAcademicField(
      field,
      {
        year,
        semester,
        name,
        icon: iconUrl
      }
    );
  }


  @Delete(':fieldId') //* FIELDS | Delete  {{host}}/academic-field/:fieldId
  async deleteAcademicField(
    @Param('fieldId', ParseMonogoIdPipe) fieldId: Types.ObjectId
  ) {
    const field = await this.academicFieldService.getAcademicFieldById(fieldId);
    return await this.academicFieldService.deleteAcademicField(field);
  }
}
