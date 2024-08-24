import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CurrentUser, HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { ListPlaylistQuery } from './dto/list-playlist.dto';
import { UserService } from '../user/user.service';
import { CreatePalyListBody } from './dto/create-playlist.dto';
import { UpdatePlaylistBody } from './dto/update-playlist.dto';
import { QuestionService } from '../question/question.service';
import { PaginationQuery } from '@app/common/utils/pagination';

@Controller('playlist')
@UseGuards(HttpAuthGuard)
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly userService: UserService,
    private readonly questionService: QuestionService
  ) { }

  @Get() //* PLAYLIST | Get all ~ {{host}}/playlist?page=1&limit=10&keywords=keyword
  async getPlaylists(
    @CurrentUser() userId: Types.ObjectId,
    @Query() query: ListPlaylistQuery
  ) {
    const { page, limit, keywords } = query;

    const user = await this.userService.getUserById(userId);

    return await this.playlistService.getPlaylists(user, { keywords }, { page, limit });
  }

  @Get(':playlistId') //* PLAYLIST | Get Questions ~ {{host}}/playlist/:playlistId?page=1&limit=10
  async getPlaylistQuestions(
    @CurrentUser() userId: Types.ObjectId,
    @Param('playlistId', ParseMonogoIdPipe) playlistId: Types.ObjectId,
    @Query() query: PaginationQuery
  ) {
    const { page, limit } = query;
    const user = await this.userService.getUserById(userId);

    const playlist = await this.playlistService.getPlaylistById(playlistId, user, { populateOptions: { page, limit } });

    return playlist.questions
  }

  @Post() //* PLAYLIST | Create ~ {{host}}/playlist
  async createPlaylist(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: CreatePalyListBody
  ) {
    const { title } = body;
    const user = await this.userService.getUserById(userId);

    return await this.playlistService.createPlaylist(user, title);
  }

  @Patch(':playlistId') //* PLAYLIST | Update ~ {{host}}/playlist/:playlistId
  async updatePlaylist(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: UpdatePlaylistBody,
    @Param('playlistId', ParseMonogoIdPipe) playlistId: Types.ObjectId
  ) {
    const { title, addQuestionId, removeQuestionId } = body;
    const user = await this.userService.getUserById(userId);
    const playlist = await this.playlistService.getPlaylistById(playlistId, user, { withQuestions: true });

    const addQuestion = addQuestionId ? await this.questionService.getQuestionById(addQuestionId) : undefined;
    const removeQuestion = removeQuestionId ? await this.questionService.getQuestionById(removeQuestionId) : undefined;


    return await this.playlistService.updatePlaylist(playlist, { title, addQuestion, removeQuestion });
  }

  @Delete(':playlistId') //* PLAYLIST | Delete ~ {{host}}/playlist/:playlistId
  async deletePlaylist(
    @CurrentUser() userId: Types.ObjectId,
    @Param('playlistId', ParseMonogoIdPipe) playlistId: Types.ObjectId
  ) {
    const user = await this.userService.getUserById(userId);
    const playlist = await this.playlistService.getPlaylistById(playlistId, user);

    await this.playlistService.deletePlaylist(playlist);

    return { message: 'Playlist deleted successfully' };
  }

}
