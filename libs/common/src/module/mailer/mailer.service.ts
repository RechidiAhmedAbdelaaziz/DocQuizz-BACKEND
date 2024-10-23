import { HttpException, Injectable } from '@nestjs/common';
import { Auth, google } from 'googleapis';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {

    private gooleAuthClient: Auth.OAuth2Client
    private transport: Transporter



    constructor() {
        const clientId = process.env.GOOGLE_MAILER_CLIENT_ID
        const clientSecret = process.env.GOOGLE_MAILER_CLIENT_SECRET
        const redirectUri = process.env.GOOGLE_MAILER_REDIRECT_URI
        const refreshToken = process.env.GOOGLE_MAILER_REFRESH_TOKEN

        this.gooleAuthClient = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
        this.gooleAuthClient.setCredentials({ refresh_token: refreshToken })

        this.transport = createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_MAILER_USER,
                clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
            }
        })

    }




    sendMail = async (details: {
        to: string, subject?: string, text?: string
    }) => {
        //set access token in transporter and send email
        try {
            const accessToken = (await this.gooleAuthClient.getAccessToken()).token
            this.transport.set('oauth2_provision_cb', (user, renew, callback) => {
                callback(null, accessToken);
            })

            return await this.transport.sendMail({
                from: 'DocQuizz <' + process.env.GOOGLE_MAILER_USER + '>',
                to: details.to,
                subject: details.subject,
                text: details.text
            })
        }
        catch (err) {
            throw new HttpException('Erreur lors de l\'envoi du mail', 500)
        }
    }
}
