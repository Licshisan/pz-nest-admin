import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsDecimal, IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

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

  @ApiPropertyOptional({ description: '状态 0休息 1在岗' })
  @IsOptional()
  @IsIn([0, 1])
  status?: number

  @ApiPropertyOptional({ description: '是否认证 0待审核 1已认证' })
  @IsOptional()
  @IsIn([0, 1])
  isVerified?: number
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

  @ApiPropertyOptional({ description: '个人简介' })
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
  @IsDecimal()
  priceHalf?: number

  @ApiPropertyOptional({ description: '全天价格', example: 499.0 })
  @IsOptional()
  @IsDecimal()
  priceFull?: number
}

// 更新 DTO
export class PzAdvisorUpdateDto extends PzAdvisorDto {
  @ApiPropertyOptional({ description: '状态 0休息 1在岗' })
  @IsOptional()
  @IsIn([0, 1])
  status?: number

  @ApiPropertyOptional({ description: '是否认证 0待审核 1已认证' })
  @IsOptional()
  @IsIn([0, 1])
  isVerified?: number

  @ApiPropertyOptional({ description: '评分', example: 5.0 })
  @IsOptional()
  @IsDecimal()
  @Min(0)
  @Max(5)
  rate?: number

  @ApiPropertyOptional({ description: '服务次数' })
  @IsOptional()
  @IsNumber()
  serviceCount?: number
}
