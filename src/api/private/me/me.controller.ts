/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SessionGuard } from '../../../identity/session.guard';
import { ConsoleLoggerService } from '../../../logger/console-logger.service';
import { MediaUploadDto } from '../../../media/media-upload.dto';
import { MediaService } from '../../../media/media.service';
import { UserLoginInfoDto } from '../../../users/user-info.dto';
import { User } from '../../../users/user.entity';
import { UsersService } from '../../../users/users.service';
import { RequestUser } from '../../utils/request-user.decorator';
import { SessionAuthProvider } from '../../utils/session-authprovider.decorator';

@UseGuards(SessionGuard)
@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(
    private readonly logger: ConsoleLoggerService,
    private userService: UsersService,
    private mediaService: MediaService,
  ) {
    this.logger.setContext(MeController.name);
  }

  @Get()
  getMe(
    @RequestUser() user: User,
    @SessionAuthProvider() authProvider: string,
  ): UserLoginInfoDto {
    return this.userService.toUserLoginInfoDto(user, authProvider);
  }

  @Get('media')
  async getMyMedia(@RequestUser() user: User): Promise<MediaUploadDto[]> {
    const media = await this.mediaService.listUploadsByUser(user);
    return await Promise.all(
      media.map((media) => this.mediaService.toMediaUploadDto(media)),
    );
  }

  @Delete()
  @HttpCode(204)
  async deleteUser(@RequestUser() user: User): Promise<void> {
    const mediaUploads = await this.mediaService.listUploadsByUser(user);
    for (const mediaUpload of mediaUploads) {
      await this.mediaService.deleteFile(mediaUpload);
    }
    this.logger.debug(`Deleted all media uploads of ${user.username}`);
    await this.userService.deleteUser(user);
    this.logger.debug(`Deleted ${user.username}`);
  }

  @Post('profile')
  @HttpCode(200)
  async updateDisplayName(
    @RequestUser() user: User,
    @Body('name') newDisplayName: string,
  ): Promise<void> {
    await this.userService.changeDisplayName(user, newDisplayName);
  }
}
