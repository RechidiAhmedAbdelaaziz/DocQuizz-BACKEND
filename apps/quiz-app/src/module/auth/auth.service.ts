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
import { UserRoles } from '@app/common';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        @InjectModel(RestPassworToken.name) private restPasswordTokenModel: Model<RestPassworToken>,
        private readonly jwtService: JwtService,
        private readonly subscriptionService: SubscriptionService,

    ) { }

    register = async (details: {
        name: string,
        email: string,
        password: string,
    },
    ) => {
        const { name, email, password } = details

        const userExists = await this.userModel.findOne({ email })
        if (userExists) throw new HttpException('Email déjà utilisé', 400)

        const user = new this.userModel()

        user.name = name
        user.email = email

        const cryptPassword = hashData(password)
        user.password = cryptPassword


        return await user.save()
    }

    login = async (data: { email: string, password?: string }, options?: {
        isOAuth?: boolean,
        asAdmin?: boolean
    }) => {
        const { email, password } = data
        const { isOAuth, asAdmin } = options || {}

        const user = await this.userModel.findOne({ email })
            .select('+password')
            .populate('domain')
            .populate('level')

        if (!user) throw new HttpException('Email non trouvé', 404)

        if (isOAuth) return user
        if (asAdmin &&
            user.role !== UserRoles.ADMIN &&
            user.role !== UserRoles.MODERATOR
        ) throw new HttpException('Tu n\'as pas les droits pour accéder à cette ressource', 403)

        const isPasswordMatch = compareHash(password, user.password)
        if (!isPasswordMatch) throw new HttpException('Mot de passe incorrect', 400)

        return user
    }

    forgetPassword = async (email: string) => {
        const user = await this.userModel.findOne({ email })
        if (!user) throw new HttpException('Il n\'y a pas de compte avec cet email', 404)

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
        if (!user) throw new HttpException('Utilisateur non trouvé', 404)

        const restPasswordToken = await this.restPasswordTokenModel.findOne(
            { user, otp, expires: { $gt: new Date() } }
        )
        if (!restPasswordToken) throw new HttpException('OTP invalide', 400)


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
        const payload = new JwtPayload(user).toPlainObject()

        const { data: subscription } = await this.subscriptionService.getSubscriptions({ user: user._id }, {})

        if (subscription.length > 0) {
            const levels = subscription.map((sub) => sub.offer.levels)
            console.log(levels)
            if (levels)
                payload.paidLevels =
                    levels.map((level) => level.map((l) => l._id)).flat()
        }

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

    // generateAdminToken() {
    //     const payload: JwtPayload = { role: UserRoles.ADMIN, id: new Types.ObjectId(), isPro: true, domain: new Types.ObjectId() }
    //     return this.jwtService.sign(payload)
    // }


}
