import { Body, Controller, Get, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { OAuthService } from './o-auth.service';
import { GoogleAuthQuery } from './dto/google-signup.dto';
import { AuthService } from '../auth/auth.service';

@Controller('o-auth')
export class OAuthController {
  constructor(
    private readonly oAuthService: OAuthService,
    private readonly authService: AuthService

  ) { }

  @Get('google') //* GOOGLE | Auth ~ {{host}}/o-auth/google
  @Redirect()
  async googleAuth() {
    const url = this.oAuthService.generateAuthUrl()

    return {
      url
    }
  }


  @Get('google/callback') //* GOOGLE | Auth ~ {{host}}/o-auth/google/callback
  async googleCallback(@Query() query: GoogleAuthQuery) {
    try {
      const details = await this.oAuthService.loginWithGoogle(query.code)
      const { email } = details

      const user = await this.authService.login({
        email,
        password: process.env.GOOGLE_USERS_PASSWORD
      })

      const tokens = await this.authService.generateTokens(user)

      return { tokens, user }
    }
    catch (error) {
      const dtails = await this.oAuthService.signUpWithGoogle(query.code)
      const { email, name } = dtails

      const user = await this.authService.register({
        email,
        password: process.env.GOOGLE_USERS_PASSWORD,
        name
      })

      const tokens = await this.authService.generateTokens(user)

      return { tokens, user }
    }


  }


}
