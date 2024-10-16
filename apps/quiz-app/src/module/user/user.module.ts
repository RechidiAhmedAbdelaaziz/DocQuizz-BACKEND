import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminUserController, UserController } from './user.controller';
import { DatabaseModule } from '@app/common';
import { User } from '@app/common/models';
import { LevelsModule } from '../levels/levels.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: User }]), LevelsModule
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
