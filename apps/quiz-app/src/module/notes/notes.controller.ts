import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Types } from 'mongoose';
import { CurrentUser, HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { CreateNoteBody } from './dto/create-note.dto';
import { QuestionService } from '../question/question.service';
import { UserService } from '../user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@app/common/module/cloudinary/cloudinary.service';
import { UpdateNoteBody } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(HttpAuthGuard)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly cloudinary: CloudinaryService
  ) { }

  @Post(':questionId') //* NOTE | Create  ~ {{host}}/notes/:questionId
  @UseInterceptors(FileInterceptor('image'))
  async createNote(
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId,
    @Body() body: CreateNoteBody,
    @CurrentUser() userId: Types.ObjectId,
    @UploadedFile() image?: Express.Multer.File,

  ) {
    const { note } = body

    const user = await this.userService.getUserById(userId)
    const question = await this.questionService.getQuestionById(questionId)

    const imageUrl = image ?
      await this.cloudinary.uploadImage(image, `notes/${user._id}/${question._id}`)
      : undefined

    return await this.notesService.createNote(user, question, { note, imageUrl })
  }

  @Patch(':noteId/:index') //* NOTE | Update  ~ {{host}}/notes/:noteId/:index
  async updateNote(
    @Param('noteId', ParseMonogoIdPipe) noteId: Types.ObjectId,
    @Param('index', ParseIntPipe) index: number,
    @Body() body: UpdateNoteBody,
    @CurrentUser() userId: Types.ObjectId
  ) {
    const { deleteNote, newNote } = body

    const user = await this.userService.getUserById(userId)
    const noteToUpdate = await this.notesService.getNoteById(noteId, user,)

    return await this.notesService.updateNote(noteToUpdate, index, { deleteNote, newNote })
  }

  @Get(':questionId') //* NOTE | Get  ~ {{host}}/notes/:questionId
  async getNote(
    @Param('questionId', ParseMonogoIdPipe) questionId: Types.ObjectId,
    @CurrentUser() userId: Types.ObjectId
  ) {
    const user = await this.userService.getUserById(userId)
    const question = await this.questionService.getQuestionById(questionId)

    const note = await this.notesService.createNote(user, question)

    return { data: note }


  }

  @Delete(':noteId') //* NOTE | Get By Id ~ {{host}}/notes/:noteId
  async getNoteById(
    @Param('noteId', ParseMonogoIdPipe) noteId: Types.ObjectId,
    @CurrentUser() userId: Types.ObjectId
  ) {
    const user = await this.userService.getUserById(userId)

    await this.notesService.getNoteById(noteId, user)

    return { message: 'Note found' }
  }


}
