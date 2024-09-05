import { Injectable } from '@nestjs/common';
import { Auth, google } from 'googleapis';

@Injectable()
export class OAuthService {
    private gooleAuthClient: Auth.OAuth2Client

    constructor() {
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
        const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI
        this.gooleAuthClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
    }


    generateAuthUrl() {
        return this.gooleAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile']
        })
    }


    async getDataFromGoogle(code: string) {
        const { tokens } = await this.gooleAuthClient.getToken(code)
        this.gooleAuthClient.setCredentials(tokens)
        const oauth2 = google.oauth2({ version: 'v2', auth: this.gooleAuthClient })
        const { data } = await oauth2.userinfo.get()
        return data
    }
}
