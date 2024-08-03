import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { CreateReferenceDto, UpdateReferenceDto } from './dto/create-reference.dto';
import { ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';

@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) { }

  @Post() //* REFERENCE | Create ~ {{host}}/reference
  async createReference(
    @Body() createReferenceDto: CreateReferenceDto,
  ) {
    const { title } = createReferenceDto;

    return await this.referenceService.createReference(title);
  }

  @Patch(':referenceId') //* REFERENCE | Update ~ {{host}}/reference/:referenceId
  async updateReference(
    @Body() createReferenceDto: UpdateReferenceDto,
    @Param('referenceId', ParseMonogoIdPipe) referenceId: Types.ObjectId,
  ) {
    const { title } = createReferenceDto;

    const reference = await this.referenceService.getReference({ _id: referenceId });
    

    return await this.referenceService.updateReference(reference, title);
  }
}


