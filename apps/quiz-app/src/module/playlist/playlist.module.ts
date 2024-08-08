import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { DatabaseModule } from '@app/common';
import { Playlist } from '@app/common/models';
import { UserModule } from '../user/user.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Playlist }]),
    UserModule,
    QuestionModule
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule { }
