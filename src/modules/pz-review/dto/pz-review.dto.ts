import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { PagerDto } from '~/common/dto/pager.dto'

// 创建 DTO
export class PzReviewDto {
  @ApiPropertyOptional({ description: '订单ID' })
  @IsNumber()
  bookingId: number

  @ApiPropertyOptional({ description: '评分 1-5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiPropertyOptional({ description: '评价内容' })
  @IsOptional()
  @IsString()
  comment?: string

  @ApiPropertyOptional({ description: '评价标签' })
  @IsOptional()
  @IsArray()
  tags?: string[]
}

// 查询 DTO
export class PzReviewQueryDto extends PagerDto<PzReviewDto> {
  @ApiPropertyOptional({ description: '陪诊师ID' })
  @IsOptional()
  @IsNumber()
  advisorId?: number

  @ApiPropertyOptional({ description: '用户ID' })
  @IsOptional()
  @IsNumber()
  userId?: number
}
