/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserInfoDto {
  /**
   * The username
   * @example "john.smith"
   */
  @IsString()
  @ApiProperty()
  username: string;

  /**
   * The display name
   * @example "John Smith"
   */
  @IsString()
  @ApiProperty()
  displayName: string;

  /**
   * URL of the profile picture
   * @example "https://hedgedoc.example.com/uploads/johnsmith.png"
   */
  @ApiProperty({
    format: 'uri',
  })
  @IsString()
  photo: string;

  /**
   * Email address of the user
   * @example "john.smith@example.com"
   */
  @ApiProperty({
    format: 'email',
  })
  @IsString()
  email: string;
}

export class UserLoginInfoDto extends UserInfoDto {
  /**
   * Identifier of the auth provider that was used to log in
   */
  @ApiProperty()
  @IsString()
  authProvider: string;
}
