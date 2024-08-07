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
import * as OTP from 'otp-generator'

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

        const otp = OTP.generate(6, { lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })
        const expires = new Date(Date.now() + 1000 * 60 * 60)

        await this.restPasswordTokenModel.findOneAndUpdate(
            { user },
            { otp, expires },
            { upsert: true, new: true }
        )

        return otp
    }


    resetPassword = async (data: {
        email: string,
        otp: string,
        password: string,
    }) => {

        const { email, otp, password } = data

        const user = await this.userModel.findOne({ email })
        if (!user) throw new HttpException('User not found', 404)

        const restPasswordToken = await this.restPasswordTokenModel.findOne(
            { user, otp, expires: { $gt: new Date() } }
        )
        if (!restPasswordToken) throw new HttpException('Invalid OTP', 400)


        const cryptPassword = hashData(password)
        user.password = cryptPassword

        await user.save()
        await restPasswordToken.deleteOne()

        return user
    }

    async checkOTP(args: { email: string, otp: string }) {
        const { email, otp } = args

        const user = await this.userModel.findOne({ email })
        if (!user) throw new HttpException('User not found', 404)

        const restPasswordToken = await this.restPasswordTokenModel.findOne(
            { user, otp, expires: { $gt: new Date() } }
        )
        if (!restPasswordToken) throw new HttpException('Invalid OTP', 400)
    }




    async generateTokens(user: User) {
        const payload: JwtPayload = { role: user.role, id: user._id, isPro: user.isPro }

        const accessToken = this.jwtService.sign(payload)
        const refreshToken = v4()
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        await this.refreshTokenModel.create(
            { token: refreshToken, expires, user },
        )

        return { accessToken, refreshToken }
    }

    async checkRefreshToken(data: {
        refreshToken: string
    }) {
        const { refreshToken } = data

        const token = await this.refreshTokenModel.findOne(
            { token: refreshToken, expires: { $gt: new Date() } }).populate('user')
        if (!token) throw new HttpException('Invalid token', 400)


        return token.user
    }


}
