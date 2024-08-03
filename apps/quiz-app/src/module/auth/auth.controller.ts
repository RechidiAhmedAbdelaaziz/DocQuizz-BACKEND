import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBody } from './dtos/register.dto';
import { LoginBody } from './dtos/login.dto';
import { CurrentUser, HttpAuthGuard, JwtPayload } from '@app/common';
import { RefreshTokenQuery } from './dtos/refresh-token.dto';
import { ForgetPasswordBody } from './dtos/forget-password.dto';
import { RestPasswordBody } from './dtos/rest-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register') //*  USER | Register  {{host}}/auth/register
  async register(
    @Body() details: RegisterBody
  ) {
    const user = await this.authService.register(details)
    const tokens = await this.authService.generateTokens(user)

    return { user, tokens }
  }

  @Post('login') //*  USER | Login  {{host}}/auth/login
  async login(
    @Body() data: LoginBody
  ) {
    const user = await this.authService.login(data)
    const tokens = await this.authService.generateTokens(user)

    return { user, tokens }
  }

  @UseGuards(HttpAuthGuard)
  @Get('refresh-token') //*  USER | Refresh Token  {{host}}/auth/refresh-token
  async refreshToken(
    @CurrentUser() userPayload: JwtPayload,
    @Query() query: RefreshTokenQuery
  ) {
    const { id: userId } = userPayload
    const { refreshToken } = query


    const user = await this.authService.findById(userId) //TODO use userService instead
    const tokens = await this.authService.refreshToken({ user, refreshToken })

    return tokens
  }

  @Post('forget-password') //*  USER | Forget Password  {{host}}/auth/forget-password
  async forgetPassword(
    @Body() data: ForgetPasswordBody
  ) {
    const { email } = data

    await this.authService.forgetPassword(email)
    return { message: 'Email sent' }
  }

  @Post('reset-password') //*  USER | Reset Password  {{host}}/auth/reset-password
  async resetPassword(
    @Body() data: RestPasswordBody
  ) {
    const { email, token, password } = data

    await this.authService.resetPassword({ email, token, password })
    return { message: 'Password reset' }
  }


}
