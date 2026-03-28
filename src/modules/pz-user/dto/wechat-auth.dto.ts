import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

// 微信小程序登录 DTO
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
}

// 获取用户手机号 DTO
export class WechatPhoneDto {
  @ApiPropertyOptional({ description: '手机号获取code' })
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
}
