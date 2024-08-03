import { Module } from '@nestjs/common';
import { OAuthService } from './o-auth.service';
import { OAuthController } from './o-auth.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OAuthController],
  providers: [OAuthService],
})
export class OAuthModule { }
