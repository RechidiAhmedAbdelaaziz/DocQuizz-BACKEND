import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { CreateQuizzBody } from './dto/create-quizz.dto';
import { UpdateQuizzBody } from './dto/update-quizz.dto';
import { Schema } from 'mongoose';
import { AcademicFieldService } from '../academic-field/academic-field.service';

@Controller('quizz')
export class QuizzController {
  constructor(
    private readonly quizzService: QuizzService,
    // private readonly fieldService : AcademicFieldService
  ) { }

  @Post() //* QUIZZ | Create {{host}}/quizz
  createQuizz(@Body() data: CreateQuizzBody) {
    //TODO use AcademicField service to get AcademicField by data.fieldId
    // return this.quizzService.createQuizz(data);
  }

  @Post(':quizzId') //* QUIZZ | Update {{host}}/quizz/:quizzId
  updateQuizz(
    @Body() data: UpdateQuizzBody,
  ) {
    //TODO use AcademicField service to get AcademicField by data.fieldId
    // return this.quizzService.updateQuizz(data);
  }

  @Delete(':quizzId') //* QUIZZ | Delete {{host}}/quizz/:quizzId
  async deleteQuizz(
    @Param('quizzId') quizzId: Schema.Types.ObjectId,
  ) {
    const quizz = await this.quizzService.getQuizz(quizzId);
    await this.quizzService.deleteQuizz(quizz);

    return {
      message: 'Quizz deleted successfully',
    };
  }


}
