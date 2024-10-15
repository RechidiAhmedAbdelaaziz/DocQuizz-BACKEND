import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBody } from './dtos/register.dto';
import { LoginBody } from './dtos/login.dto';
import { RefreshTokenQuery } from './dtos/refresh-token.dto';
import { ForgetPasswordBody } from './dtos/forget-password.dto';
import { RestPasswordBody } from './dtos/rest-password.dto';
import { VerifyOtpBody } from './dtos/verify-otp.dto';
import { StatisticService } from '../statistic/statistic.service';
import { MailerService } from '@app/common/module/mailer/mailer.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly statisticService: StatisticService,
    private readonly mailerService: MailerService
  ) { }

  @Post('register') //*  USER | Register  {{host}}/auth/register
  async register(
    @Body() details: RegisterBody
  ) {
    const user = await this.authService.register(details)

    await this.statisticService.updateStatistic({ newUser: 1 })

    const tokens = await this.authService.generateTokens(user)

    return { data: user, tokens }
  }

  @Post('login') //*  USER | Login  {{host}}/auth/login
  async login(
    @Body() data: LoginBody
  ) {
    const user = await this.authService.login(data)
    const tokens = await this.authService.generateTokens(user)

    return { data: user, tokens }
  }

  @Post('login-admin') //*  ADMIN | Login  {{host}}/auth/login-admin
  async loginAdmin(
    @Body() data: LoginBody
  ) {
    const user = await this.authService.login(data, { asAdmin: true })
    const tokens = await this.authService.generateTokens(user)

    return { data: user, tokens }
  }



  @Get('refresh-token') //*  USER | Refresh Token  {{host}}/auth/refresh-token
  async refreshToken(
    @Query() query: RefreshTokenQuery
  ) {
    const { refreshToken } = query


    const user = await this.authService.checkRefreshToken({ refreshToken })
    const tokens = await this.authService.generateTokens(user)

    return { tokens }
  }

  @Post('forget-password') //*  USER | Forget Password  {{host}}/auth/forget-password
  async forgetPassword(
    @Body() data: ForgetPasswordBody
  ) {
    const { email } = data

    const otp = await this.authService.forgetPassword(email)

    await this.mailerService.sendMail({
      to: email,
      subject: 'Forget Password',
      text: `Your OTP is ${otp}`
    })

    return { message: 'Email sent' }
  }

  @Post('verify-otp') //*  OTP | Verify  {{host}}/auth/verify-otp
  async verifyOTP(
    @Body() data: VerifyOtpBody
  ) {
    const { email, otp } = data

    await this.authService.checkOTP({ email, otp })
    return { message: 'OTP verified' }
  }

  @Post('reset-password') //*  PASSWORD | Reset   {{host}}/auth/reset-password
  async resetPassword(
    @Body() data: RestPasswordBody
  ) {
    const { email, otp, password } = data

    await this.authService.resetPassword({ email, otp, password })
    return { message: 'Password reset' }
  }

  @Put('getAdmin') //*  ADMIN | Get Admin  {{host}}/auth/getAdmin
  getAdmin() {
    const adminToken = this.authService.generateAdminToken()
    return { data: adminToken }
  }


}
