import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, HttpAuthGuard } from '@app/common';
import { Types } from 'mongoose';
import { UpdateUserBody } from './dto/update-user.dto';
import { UpdatePasswordBody } from './dto/update-password.dto';
import { UpdateAnalyseBody } from './dto/update-analyse.dto';
import { LevelsService } from '../levels/levels.service';

@UseGuards(HttpAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,

    private readonly levelService: LevelsService
  ) { }


  @Get('me') //* USER | Get profile ~ {{host}}/user/me
  async getProfile(
    @CurrentUser() userId: Types.ObjectId
  ) {
    const user = await this.userService.getUserById(userId);

    return user
  }

  @Patch('me') //* USER | Update profile ~ {{host}}/user/me
  async updateProfile(
    @CurrentUser() userId: Types.ObjectId,
    @Body() updates: UpdateUserBody
  ) {
    const { levelId, email, name, domainId } = updates;

    const user = await this.userService.getUserById(userId);


    if (email) await this.userService.checkEmail(updates.email)

    const level = levelId ? await this.levelService.getLevelById(levelId) : undefined;
    const domain = domainId ? await this.levelService.getDomainById(domainId) : undefined;

    return await this.userService.updateUser(user, { email, name, level , domain})
  }

  @Patch('me/password') //* USER | Update password ~ {{host}}/user/me/password
  async updatePassword(
    @CurrentUser() userId: Types.ObjectId,
    @Body() info: UpdatePasswordBody
  ) {
    const user = await this.userService.getUserById(userId, { withPassword: true });

    await this.userService.updatePassword(user, info)

    return { message: 'password updated successfully' }
  }

}
