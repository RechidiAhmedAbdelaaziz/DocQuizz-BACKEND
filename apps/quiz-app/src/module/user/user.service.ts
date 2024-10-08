import { compareHash, hashData } from '@app/common';
import { Domain, Level, Major, User } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }


    updateUser = async (
        user: User,
        updates: {
            isPro?: boolean;
            name?: string;
            email?: string;
            level?: Level;
            createQuiz?: boolean;
            createPlaylist?: boolean;
            domain?: Domain
        }
    ) => {
        const { isPro, name, email, level, createQuiz, createPlaylist, domain } = updates;


        if (isPro !== undefined) user.isPro = isPro;
        if (name) user.name = name;
        if (email) user.email = email;
        if (level) user.level = level;
        if (domain) user.domain = domain;
        if (createQuiz) user.quizez++;
        if (createPlaylist) user.playlists++;

        return await user.save();
    }

    updatePassword = async (
        user: User,
        info: {
            oldPassword: string;
            newPassword: string;
        }
    ) => {
        const { oldPassword, newPassword } = info;

        if (!compareHash(oldPassword, user.password)) throw new HttpException('Old password is not correct', 400)
        user.password = hashData(newPassword);

        await user.save();
    }


    async checkEmail(email: string) {
        const check = await this.userModel.findOne({ email })
        if (check) throw new HttpException('Email already exists', 400)
    }

    async getUserById(id: Types.ObjectId, options?: {
        withPassword?: boolean,
        withAnalyse?: boolean
    }) {
        const { withPassword, withAnalyse } = options || {}

        const query = this.userModel.findById(id)
            .populate('domain')
            .populate('level')

        if (withPassword) query.select('password')
        if (withAnalyse) query.select('analyse')

        const user = await query.exec()
        if (!user) throw new HttpException('User not found', 404)
        return user
    }
}
