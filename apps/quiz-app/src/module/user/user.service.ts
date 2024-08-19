import { compareHash, hashData } from '@app/common';
import { User } from '@app/common/models';
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
            speciality?: {
                domain: string;
                level: string;
                faculty: string;
            };
            createQuiz?: boolean;
            createPlaylist?: boolean;
        }
    ) => {
        const { isPro, name, email, speciality, createQuiz, createPlaylist } = updates;


        if (isPro !== undefined) user.isPro = isPro;
        if (name) user.name = name;
        if (email) user.email = email;
        if (speciality) user.speciality = speciality;
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

    updateAnalyse = async (
        user: User,
        analyse: {
            major: string;
            isCorrectAnswers: boolean;
        }) => {
        const { major, isCorrectAnswers } = analyse;

        if(!user.analyse) user.analyse = [];

        const index = user.analyse.findIndex(a => a.major === major);
        if (index !== -1) {
            if (isCorrectAnswers) user.analyse[index].correctAnswers++;
            else user.analyse[index].wrongAnswers++;
        } else {
            user.analyse.push({
                major,
                correctAnswers: isCorrectAnswers ? 1 : 0,
                wrongAnswers: isCorrectAnswers ? 0 : 1
            })
        }

        user.markModified('analyse');

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

        if (withPassword) query.select('password')
        if (withAnalyse) query.select('analyse')

        const user = await query.exec()
        if (!user) throw new HttpException('User not found', 404)
        return user
    }
}
