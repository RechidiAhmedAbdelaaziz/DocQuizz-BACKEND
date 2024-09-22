import { Playlist, Question, User } from '@app/common/models';
import { Pagination } from '@app/common/utils/pagination';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class PlaylistService {

    constructor(
        @InjectModel(Playlist.name) private readonly playlistModel: Model<Playlist>,
    ) { }

    createPlaylist = async (user: User, title: string) => {
        const playlist = new this.playlistModel();

        playlist.title = title;
        playlist.user = user;

        return playlist.save();
    }

    updatePlaylist = async (
        playlist: Playlist,
        update: {
            title?: string,
            addQuestion?: Question,
            removeQuestion?: Question,
        }
    ) => {
        const { title, addQuestion, removeQuestion } = update;

        if (title) {
            playlist.title = title;
        }
        if (addQuestion) {
            const questionExists = playlist.questions.some(question => question._id.equals(addQuestion._id));
            if (!questionExists) {
                playlist.questions.push(addQuestion);
            }
        }
        if (removeQuestion) {
            playlist.questions = playlist.questions.filter(question => !question._id.equals(removeQuestion._id));
        }

        playlist.totalQuestions = playlist.questions.length;

        return await playlist.save();
    }

    deletePlaylist = async (playlist: Playlist) => {
        await playlist.deleteOne();
    }

    getPlaylists = async (user: User,
        options: {
            keywords?: string,
        },
        pagination: {
            page: number,
            limit: number,
        }
    ) => {

        const { keywords } = options;

        const filter: FilterQuery<Playlist> = { user: user };

        if (keywords) {
            const keywordsArray = keywords.split(' ')
            filter.$and = keywordsArray.map(keyword => ({
                title: { $regex: keyword, $options: 'i' }
            }))
        }

        const { generate, limit, page } = new Pagination(this.playlistModel, { filter, ...pagination }).getOptions();

        const playlists = await this.playlistModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)

        return await generate(playlists);
    }


    async getPlaylistById(
        playlistId: Types.ObjectId,
        user: User,
        options?: {
            withQuestions?: boolean,
            populateOptions?: {
                page?: number,
                limit?: number
            }
        }
    ) {
        const { withQuestions, populateOptions } = options || {};
        const page = populateOptions?.page || 1
        const limit = populateOptions?.limit || 15

        const query = this.playlistModel.findOne({ _id: playlistId, user: user });
        if (withQuestions) query.select('+questions');
        if (populateOptions) query
            .select({
                questions: { $slice: [(page - 1) * limit, limit] }
            })
            .populate({
                path: 'questions',
                populate: [
                    { path: 'exam' },
                    { path: 'course' },
                    { path: 'source' }
                ]
            })

        const playlist = await query.exec();
        if (!playlist) throw new HttpException('Playlist not found', 404);
        return playlist;
    }
}
