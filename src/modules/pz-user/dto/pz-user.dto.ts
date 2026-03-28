import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'

// 查询 DTO
export class PzUserQueryDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  page: number

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  pageSize: number

  @ApiPropertyOptional({ description: '微信昵称' })
  @IsOptional()
  @IsString()
  nickname?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: '状态 0禁用 1正常' })
  @IsOptional()
  @IsIn([0, 1])
  status?: number
}

// 新增用户 DTO
export class PzUserDto {
  @ApiPropertyOptional({ description: '微信openid' })
  @IsString()
  openid: string

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

  @ApiPropertyOptional({ description: '性别 0未知 1男 2女' })
  @IsOptional()
  @IsIn([0, 1, 2])
  gender?: number

  @ApiPropertyOptional({ description: '生日' })
  @IsOptional()
  birthday?: Date

  @ApiPropertyOptional({ description: '身份证号' })
  @IsOptional()
  @IsString()
  idCard?: string
}

// 更新用户 DTO
export class PzUserUpdateDto extends PzUserDto {
  @ApiPropertyOptional({ description: '状态 0禁用 1正常' })
  @IsOptional()
  @IsIn([0, 1])
  status?: number
}
