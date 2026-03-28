import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsDateString, IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator'

// 查询 DTO
export class PzScheduleQueryDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  page: number

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  pageSize: number

  @ApiPropertyOptional({ description: '陪诊师ID' })
  @IsOptional()
  @IsNumber()
  advisorId?: number

  @ApiPropertyOptional({ description: '排班日期' })
  @IsOptional()
  @IsDateString()
  scheduleDate?: string

  @ApiPropertyOptional({ description: '时段 1上午 2下午 3晚上' })
  @IsOptional()
  @IsIn([1, 2, 3])
  period?: number

  @ApiPropertyOptional({ description: '是否可预约' })
  @IsOptional()
  @IsIn([0, 1])
  isAvailable?: number
}

// 创建 DTO
export class PzScheduleDto {
  @ApiPropertyOptional({ description: '陪诊师ID' })
  @IsNumber()
  advisorId: number

  @ApiPropertyOptional({ description: '排班日期' })
  @IsDateString()
  scheduleDate: string

  @ApiPropertyOptional({ description: '时段 1上午 2下午 3晚上' })
  @IsNumber()
  @IsIn([1, 2, 3])
  period: number

  @ApiPropertyOptional({ description: '具体时段' })
  @IsArray()
  timeSlots: string[]

  @ApiPropertyOptional({ description: '最大可预约数' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxBookings?: number
}

// 批量创建 DTO
export class PzScheduleBatchDto {
  @ApiPropertyOptional({ description: '陪诊师ID' })
  @IsNumber()
  advisorId: number

  @ApiPropertyOptional({ description: '开始日期' })
  @IsDateString()
  startDate: string

  @ApiPropertyOptional({ description: '结束日期' })
  @IsDateString()
  endDate: string

  @ApiPropertyOptional({ description: '时段数组' })
  @IsArray()
  periods: number[]

  @ApiPropertyOptional({ description: '具体时段' })
  @IsArray()
  timeSlots: string[]

  @ApiPropertyOptional({ description: '最大可预约数' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxBookings?: number
}

// 更新 DTO
export class PzScheduleUpdateDto {
  @ApiPropertyOptional({ description: '具体时段' })
  @IsOptional()
  @IsArray()
  timeSlots?: string[]

  @ApiPropertyOptional({ description: '最大可预约数' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxBookings?: number

  @ApiPropertyOptional({ description: '是否可预约' })
  @IsOptional()
  @IsIn([0, 1])
  isAvailable?: number
}
