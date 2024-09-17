import { Body, Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { OAuthService } from './o-auth.service';
import { GoogleAuthQuery } from './dto/google-signup.dto';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';
import { StatisticService } from '../statistic/statistic.service';

@Controller('o-auth')
export class OAuthController {
  constructor(
    private readonly oAuthService: OAuthService,
    private readonly authService: AuthService,
    private readonly statisticService: StatisticService

  ) { }


  @Get('google') //* GOOGLE | Auth ~ {{host}}/o-auth/google
  async googleAuth(@Res() res: Response) {
    const url = this.oAuthService.generateAuthUrl()
    res.redirect(url)
    return {}
  }


  @Get('google/callback') //* GOOGLE | Auth ~ {{host}}/o-auth/google/callback
  async googleCallback(@Query() query: GoogleAuthQuery, @Req() req: Request) {

    const details = await this.oAuthService.getDataFromGoogle(query.code)
    try {
      const { email } = details

      const user = await this.authService.login({ email }, { isOAuth: true })
      const tokens = await this.authService.generateTokens(user)

      return { tokens, user }
    }
    catch (error) {
      const { email, name } = details

      const user = await this.authService.register({
        email,
        password: process.env.GOOGLE_USERS_PASSWORD,
        name
      })

      await this.statisticService.updateStatistic({ newUser: 1 })

      const tokens = await this.authService.generateTokens(user)

      return { tokens, user }
    }


  }




}
