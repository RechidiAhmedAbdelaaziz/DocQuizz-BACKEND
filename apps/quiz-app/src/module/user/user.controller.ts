import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, HttpAuthGuard } from '@app/common';
import { Types } from 'mongoose';
import { UpdateUserBody } from './dto/update-user.dto';
import { UpdatePasswordBody } from './dto/update-password.dto';
import { UpdateAnalyseBody } from './dto/update-analyse.dto';

@UseGuards(HttpAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


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
    if (updates.email) await this.userService.checkEmail(updates.email)

    const user = await this.userService.getUserById(userId);

    return await this.userService.updateUser(user, updates)
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

  @Patch('me/analyse') //* USER | Update analyse ~ {{host}}/user/me/analyse
  async updateAnalyse(
    @CurrentUser() userId: Types.ObjectId,
    @Body() analyse: UpdateAnalyseBody
  ) {
    const user = await this.userService.getUserById(userId, { withAnalyse: true });

    await this.userService.updateAnalyse(user, analyse)

    return { message: 'analyse updated successfully' }
  }
}
