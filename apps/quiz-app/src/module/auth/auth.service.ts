import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { JwtPayload } from '@app/common/shared/jwt-payload';
import { compareHash, hashData } from '@app/common/utils/hasher';
import { RefreshToken } from '@app/common/models/refresh-token.model';
import { RestPassworToken } from '@app/common/models/rest-password-token.model';
import { User } from '@app/common/models/user.model';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        @InjectModel(RestPassworToken.name) private restPasswordTokenModel: Model<RestPassworToken>,
        private readonly jwtService: JwtService
    ) { }

    register = async (details: {
        name: string,
        email: string,
        password: string,
    }) => {
        const { name, email, password } = details

        const userExists = await this.userModel.findOne({ email })
        if (userExists) throw new HttpException('Email already exists', 400)

        const user = new this.userModel()

        user.name = name
        user.email = email

        const cryptPassword = hashData(password)
        user.password = cryptPassword


        return await user.save()
    }

    login = async (data: { email: string, password: string }) => {
        const { email, password } = data

        const user = await this.userModel.findOne({ email }).select('+password')

        if (!user) throw new HttpException('Email not found', 404)

        const isPasswordMatch = compareHash(password, user.password)
        if (!isPasswordMatch) throw new HttpException('Invalid password', 400)

        return user
    }

    forgetPassword = async (email: string) => {
        const user = await this.userModel.findOne({ email })
        if (!user) throw new HttpException('Email not found', 404)

        const token = v4()
        const expires = new Date(Date.now() + 1000 * 60 * 60)

        await this.restPasswordTokenModel.findOneAndUpdate(
            { user },
            { token, expires },
            { upsert: true, new: true }
        )

        return token
    }


    resetPassword = async (data: {
        email: string,
        token: string,
        password: string,
    }) => {

        const { email, token, password } = data

        const user = await this.userModel.findOne({ email })
        if (!user) throw new HttpException('User not found', 404)

        const restPasswordToken = await this.restPasswordTokenModel.findOne(
            { user, token, expires: { $gt: new Date() } }
        )
        if (!restPasswordToken) throw new HttpException('Invalid token', 400)


        const cryptPassword = hashData(password)
        user.password = cryptPassword

        await user.save()
        await restPasswordToken.deleteOne()

        return user
    }




    async generateTokens(user: User) {
        const payload: JwtPayload = { email: user.email, id: user._id }

        const accessToken = this.jwtService.sign(payload)
        const refreshToken = v4()
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        await this.refreshTokenModel.findOneAndUpdate(
            { user },
            { token: refreshToken, expires },
            { upsert: true, new: true })

        return { accessToken, refreshToken }
    }

    async refreshToken(data: {
        user: User,
        refreshToken: string
    }) {
        const { user, refreshToken } = data

        const token = await this.refreshTokenModel.findOne(
            { user, token: refreshToken, expires: { $gt: new Date() } })
        if (!token) throw new HttpException('Invalid token', 400)

        const payload: JwtPayload = { email: user.email, id: user._id }
        const accessToken = this.jwtService.sign(payload)
        const newRefreshToken = v4()
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        token.token = newRefreshToken
        token.expires = expires
        await token.save()

        return { accessToken, refreshToken: newRefreshToken }
    }

    async findById(id: Types.ObjectId) { //TODO remove this after implementing userService
        return await this.userModel.findById(id)
    }
}
