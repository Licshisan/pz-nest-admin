import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

// 查询 DTO
export class PzPatientQueryDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  page: number

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  pageSize: number

  @ApiPropertyOptional({ description: '用户ID' })
  @IsOptional()
  @IsNumber()
  userId?: number

  @ApiPropertyOptional({ description: '是否默认就诊人' })
  @IsOptional()
  @IsIn([0, 1])
  isDefault?: number
}

// 创建 DTO
export class PzPatientDto {
  @ApiPropertyOptional({ description: '就诊人姓名' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '性别 1男 2女' })
  @IsNumber()
  @IsIn([1, 2])
  gender: number

  @ApiPropertyOptional({ description: '年龄' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  age?: number

  @ApiPropertyOptional({ description: '手机号' })
  @IsString()
  phone: string

  @ApiPropertyOptional({ description: '身份证号' })
  @IsOptional()
  @IsString()
  idCard?: string

  @ApiPropertyOptional({ description: '是否默认就诊人' })
  @IsOptional()
  @IsIn([0, 1])
  isDefault?: number
}

// 更新 DTO
export class PzPatientUpdateDto extends PzPatientDto {}
