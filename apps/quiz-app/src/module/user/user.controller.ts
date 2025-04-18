import { Body, Controller, Delete, Get, HttpException, Param, ParseBoolPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard, CurrentUser, HttpAuthGuard, ParseMonogoIdPipe, SuperAdminGuard, UserRoles } from '@app/common';
import { Types } from 'mongoose';
import { UpdateUserBody, UpdateUserRoleBody } from './dto/update-user.dto';
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

    return await this.userService.updateUser(user, { email, name, level, domain })
  }

  @Patch('me/password') //* USER | Update password ~ {{host}}/user/me/password
  async updatePassword(
    @CurrentUser() userId: Types.ObjectId,
    @Body() info: UpdatePasswordBody
  ) {
    const user = await this.userService.getUserById(userId, { withPassword: true });

    await this.userService.updatePassword(user, info)

    return { message: 'mot de passe mis à jour avec succès' }
  }

  @Delete('me') //* USER | Delete account ~ {{host}}/user/me
  async deleteUser(
    @CurrentUser() userId: Types.ObjectId
  ) {
    const user = await this.userService.getUserById(userId);

    await this.userService.deleteUser(user)

    return { message: 'Compte supprimé avec succès' }
  }



}


@UseGuards(SuperAdminGuard)
@Controller('admins')
export class AdminUserController {
  constructor(private readonly userService: UserService,

  ) { }

  @Get() //* ADMIN | Get moderators ~ {{host}}/admins
  async getUsers(
    @CurrentUser() userId: Types.ObjectId
  ) {


    return await this.userService.getModeratorsAndAdmins({ you: userId })
  }

  @Post() //* ADMIN | Update moderator ~ {{host}}/admins/
  async updateUser(
    @Body() body: UpdateUserRoleBody
  ) {
    const { userEmail, role } = body;

    const user = await this.userService.getUserByEmail(userEmail);

    return await this.userService.updateUser(user, { role: role })
  }

  @Delete(':userId') //* ADMIN | Delete moderator ~ {{host}}/admins/:userId
  async deleteUser(
    @Param('userId', ParseMonogoIdPipe) userId: Types.ObjectId
  ) {


    const user = await this.userService.getUserById(userId);

    await this.userService.updateUser(user, { role: UserRoles.USER })

    return { message: 'Moderator deleted successfully' }
  }




}
