import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { AdvisorStatus, AdvisorVerified } from '../pz-advisor.entity'

// 查询 DTO
export class PzAdvisorQueryDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  page: number

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  pageSize: number

  @ApiPropertyOptional({ description: '陪诊师姓名' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '状态', enum: AdvisorStatus })
  @IsOptional()
  @IsEnum(AdvisorStatus)
  status?: AdvisorStatus

  @ApiPropertyOptional({ description: '认证状态', enum: AdvisorVerified })
  @IsOptional()
  @IsEnum(AdvisorVerified)
  isVerified?: AdvisorVerified
}

// 新增 DTO
export class PzAdvisorDto {
  @ApiPropertyOptional({ description: '陪诊师姓名' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiPropertyOptional({ description: '职称' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({
    description: '个人介绍（支持富文本格式，如 HTML、Markdown 等）',
    example: '<p><strong>专业陪诊师</strong>，拥有5年医院陪诊经验，擅长：</p><ul><li>内科疾病陪诊</li><li>手术前后陪护</li><li>老年患者照护</li></ul>',
  })
  @IsOptional()
  @IsString()
  intro?: string

  @ApiPropertyOptional({ description: '标签数组' })
  @IsOptional()
  @IsArray()
  tags?: string[]

  @ApiPropertyOptional({ description: '从业经验' })
  @IsOptional()
  @IsString()
  exp?: string

  @ApiPropertyOptional({ description: '擅长科室' })
  @IsOptional()
  @IsArray()
  specialties?: string[]

  @ApiPropertyOptional({ description: '半天价格', example: 299.0 })
  @IsOptional()
  @IsNumber()
  priceHalf?: number

  @ApiPropertyOptional({ description: '全天价格', example: 499.0 })
  @IsOptional()
  @IsNumber()
  priceFull?: number
}

// 更新 DTO
export class PzAdvisorUpdateDto extends PzAdvisorDto {
  @ApiPropertyOptional({ description: '状态', enum: AdvisorStatus })
  @IsOptional()
  @IsEnum(AdvisorStatus)
  status?: AdvisorStatus

  @ApiPropertyOptional({ description: '认证状态', enum: AdvisorVerified })
  @IsOptional()
  @IsEnum(AdvisorVerified)
  isVerified?: AdvisorVerified

  @ApiPropertyOptional({ description: '评分', example: 5.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rate?: number

  @ApiPropertyOptional({ description: '服务次数' })
  @IsOptional()
  @IsNumber()
  serviceCount?: number
}
