import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'
import { PagerDto } from '~/common/dto/pager.dto'

export class PzServiceItemCreateDto {
  @ApiPropertyOptional({ description: '服务项名称' })
  @IsString()
  @MaxLength(255)
  name: string

  @ApiPropertyOptional({ description: '价格(元)' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number

  @ApiPropertyOptional({ description: '服务类型', required: false })
  @IsString()
  serviceType: string

  @ApiPropertyOptional({ description: '服务时长(小时)', required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? Number(value) : undefined)
  duration?: number

  @ApiPropertyOptional({ description: '排序值(越小越靠前)', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? Number(value) : 0)
  sort?: number

  @ApiPropertyOptional({ description: '状态 1启用 0禁用', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? Number(value) : 1)
  status?: number
}

export class PzServiceItemQueryDto extends PagerDto<PzServiceItemCreateDto> {
  @ApiPropertyOptional({ description: '服务类型', required: false })
  @IsOptional()
  serviceType?: string

  @ApiPropertyOptional({ description: '服务项名称(模糊搜索)', required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '状态 1启用 0禁用', required: false })
  @IsOptional()
  @IsInt()
  status?: number
}

export class PzServiceItemUpdateDto extends PzServiceItemCreateDto {}
