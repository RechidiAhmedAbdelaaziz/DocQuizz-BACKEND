import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { DatabaseModule } from '@app/common';
import { Note } from '@app/common/models';
import { CloudinaryModule } from '@app/common/module/cloudinary/cloudinary.module';
import { QuestionModule } from '../question/question.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Note }]),
    CloudinaryModule,
    QuestionModule,
    UserModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService]
})
export class NotesModule { }
