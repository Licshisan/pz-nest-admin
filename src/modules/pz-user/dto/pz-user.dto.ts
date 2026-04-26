import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'
import { UserGender, UserStatus } from '../pz-user.entity'

// 微信登录 DTO
export class WechatLoginDto {
  @ApiPropertyOptional({ description: '微信登录code' })
  @IsString()
  code: string

  @ApiPropertyOptional({ description: '用户信息加密数据' })
  @IsOptional()
  @IsString()
  encryptedData?: string

  @ApiPropertyOptional({ description: '加密算法的初始向量' })
  @IsOptional()
  @IsString()
  iv?: string

  @ApiPropertyOptional({ description: '新用户默认昵称' })
  @IsOptional()
  @IsString()
  defaultNickname?: string
}

// 小程序用户更新资料 DTO
export class PzUserUpdateProfileDto {
  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname?: string

  @ApiPropertyOptional({ description: '头像 URL' })
  @IsOptional()
  @IsString()
  avatar?: string
}

// 新增用户 DTO
export class PzUserDto {
  @ApiPropertyOptional({ description: '微信openid' })
  @IsOptional()
  @IsString()
  openid?: string

  @ApiPropertyOptional({ description: '微信unionid' })
  @IsOptional()
  @IsString()
  unionid?: string

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname?: string

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: '真实姓名' })
  @IsOptional()
  @IsString()
  realName?: string

  @ApiPropertyOptional({ description: '性别', enum: UserGender })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender

  @ApiPropertyOptional({ description: '生日' })
  @IsOptional()
  birthday?: Date

  @ApiPropertyOptional({ description: '身份证号' })
  @IsOptional()
  @IsString()
  idCard?: string

  @ApiPropertyOptional({ description: '状态', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus
}

// 查询 DTO
export class PzUserQueryDto extends PagerDto<PzUserDto> {
  @ApiPropertyOptional({ description: '微信昵称' })
  @IsOptional()
  @IsString()
  nickname?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: '状态', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus
}

// 更新用户 DTO
export class PzUserUpdateDto extends PartialType(PzUserDto) {}
