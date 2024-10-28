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
            question?: Question,
        },
        pagination: {
            page: number,
            limit: number,
        }

    ) => {

        const { keywords, question } = options;

        const filter: FilterQuery<Playlist> = { user: user._id };

        if (keywords) {
            const keywordsArray = keywords.split(' ')
            filter.$and = keywordsArray.map(keyword => ({
                title: { $regex: keyword, $options: 'i' }
            }))
        }

        const { generate, limit, page } = new Pagination(this.playlistModel, { filter, ...pagination }).getOptions();

        // const addFields: any = question ? {
        //     isIn: {
        //         $in: [question._id, "$questions"]
        //     }
        // } : {};

        const fields: any = {
            _id: 1,
            title: 1,
            totalQuestions: 1,
        }

        if (question) fields.isIn = { $in: [question._id, "$questions"] }


        const playlists = await this.playlistModel.aggregate([
            {
                $match: filter
            },
            {
                $project: fields
            },
            { $skip: (page - 1) * limit },  // Apply pagination within the aggregation
            { $limit: limit }
        ]);

        // console.log(playlists);

        // const playlists = await this.playlistModel.find(filter)
        //     .skip((page - 1) * limit)
        //     .limit(limit)

        return await generate(playlists);
    }

    addQuestions = async (question: Question, playlistsIds: {
        playlistsToAdd: Types.ObjectId[],
        playlistsToRemove: Types.ObjectId[]


    }) => {
        const { playlistsToAdd, playlistsToRemove } = playlistsIds;
        const playlists = await this.playlistModel
            .find({
                _id: { $in: [...playlistsToAdd, ...playlistsToRemove] }
            })
            .select('_id questions');

        const promises = []

        for (const playlist of playlists) {

            let isToAdd;

            for (const id of playlistsToAdd) {
                if (playlist._id.equals(id)) {
                    isToAdd = true;
                    break;
                }
            }

            if (isToAdd) {
                const questionExists = playlist.questions.some(q => q._id.equals(question._id));
                if (!questionExists) {
                    playlist.questions.push(question);
                    playlist.totalQuestions = playlist.questions.length;
                    promises.push(playlist.save());
                }
            }
            else {

                playlist.questions = playlist.questions.filter(q => !q._id.equals(question._id));
                playlist.totalQuestions = playlist.questions.length;
                promises.push(playlist.save());
            }
        }

        await Promise.all(promises);

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
        const limit = populateOptions?.limit || 10

        const query = this.playlistModel.findOne({ _id: playlistId, user: user });
        if (withQuestions) query.select('+questions');
        if (populateOptions) query
            .select({
                questions: { $slice: [(page - 1) * limit, limit] }
            })
            .populate({
                path: 'questions',
                populate: [
                    // { path: 'exams' },
                    { path: 'course' },
                    { path: 'sources.source' }
                ]
            })

        const playlist = await query.exec();
        if (!playlist) throw new HttpException('Playlist not found', 404);
        return playlist;
    }
}
