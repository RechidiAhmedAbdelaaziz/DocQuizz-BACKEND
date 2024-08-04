import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '@app/common';
import { User } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: User }])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
