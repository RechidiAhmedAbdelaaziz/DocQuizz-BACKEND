import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { CreateQuizzBody } from './dto/create-quizz.dto';
import { UpdateQuizzBody } from './dto/update-quizz.dto';
import { Types } from 'mongoose';
import { AcademicFieldService } from '../academic-field/academic-field.service';
import { CoursesService } from '../courses/courses.service';
import { ReferenceService } from '../reference/reference.service';
import { ParseMonogoIdPipe } from '@app/common';

@Controller('quizz')
export class QuizzController {
  constructor(
    private readonly quizzService: QuizzService,
    private readonly fieldService: AcademicFieldService,
    private readonly courseService: CoursesService,
    private readonly referenceService: ReferenceService
  ) { }

  @Post() //* QUIZZ | Create {{host}}/quizz
  async createQuizz(@Body() data: CreateQuizzBody) {
    const { correctAnswers, courseId, difficulty, explanation, notes, fieldId, incorrectAnswers, question, referenceId, year } = data;

    const field = await this.fieldService.getAcademicFieldById(fieldId);
    const course = await this.courseService.getCourseById(courseId);
    const reference = await this.referenceService.getReference({ _id: referenceId });

    return this.quizzService.createQuizz({
      correctAnswers,
      course,
      difficulty,
      explanation,
      field,
      incorrectAnswers,
      notes,
      question,
      reference,
      year,
    });
  }

  @Patch(':quizzId') //* QUIZZ | Update {{host}}/quizz/:quizzId
  async updateQuizz(
    @Body() data: UpdateQuizzBody,
    @Param('quizzId', ParseMonogoIdPipe) quizzId: Types.ObjectId,
  ) {
    const { correctAnswers, courseId, difficulty, notes, explanation, fieldId, incorrectAnswers, question, referenceId, year } = data;

    const quizz = await this.quizzService.getQuizz(quizzId);

    const field = await this.fieldService.getAcademicFieldById(fieldId);
    const course = await this.courseService.getCourseById(courseId);
    const reference = await this.referenceService.getReference({ _id: referenceId });

    return this.quizzService.updateQuizz(quizz, {
      correctAnswers,
      course,
      difficulty,
      explanation,
      field,
      incorrectAnswers,
      notes,
      question,
      reference,
      year,
    });

  }

  @Delete(':quizzId') //* QUIZZ | Delete {{host}}/quizz/:quizzId
  async deleteQuizz(
    @Param('quizzId') quizzId: Types.ObjectId,
  ) {
    const quizz = await this.quizzService.getQuizz(quizzId);
    await this.quizzService.deleteQuizz(quizz);

    return {
      message: 'Quizz deleted successfully',
    };
  }


}
