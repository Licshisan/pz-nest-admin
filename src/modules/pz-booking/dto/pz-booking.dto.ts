import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

// 查询 DTO
export class PzBookingQueryDto {
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

  @ApiPropertyOptional({ description: '陪诊师ID' })
  @IsOptional()
  @IsNumber()
  advisorId?: number

  @ApiPropertyOptional({ description: '订单状态 1待支付 2待接单 3服务中 4已完成 5已取消 6已退款' })
  @IsOptional()
  @IsIn([1, 2, 3, 4, 5, 6])
  status?: number

  @ApiPropertyOptional({ description: '服务日期开始' })
  @IsOptional()
  @IsDateString()
  serviceDateFrom?: string

  @ApiPropertyOptional({ description: '服务日期结束' })
  @IsOptional()
  @IsDateString()
  serviceDateTo?: string
}

// 创建订单 DTO
export class PzBookingCreateDto {
  @ApiPropertyOptional({ description: '陪诊师ID' })
  @IsNumber()
  advisorId: number

  @ApiPropertyOptional({ description: '就诊人姓名' })
  @IsString()
  patientName: string

  @ApiPropertyOptional({ description: '就诊人性别 1男 2女' })
  @IsNumber()
  @IsIn([1, 2])
  patientGender: number

  @ApiPropertyOptional({ description: '就诊人年龄' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  patientAge?: number

  @ApiPropertyOptional({ description: '就诊人手机号' })
  @IsString()
  patientPhone: string

  @ApiPropertyOptional({ description: '就诊人身份证' })
  @IsOptional()
  @IsString()
  patientIdCard?: string

  @ApiPropertyOptional({ description: '服务类型 1全程陪诊 2代办跑腿 3就医指导' })
  @IsNumber()
  @IsIn([1, 2, 3])
  serviceType: number

  @ApiPropertyOptional({ description: '服务时段 1上午 2下午 3晚上' })
  @IsNumber()
  @IsIn([1, 2, 3])
  servicePeriod: number

  @ApiPropertyOptional({ description: '服务日期' })
  @IsDateString()
  serviceDate: string

  @ApiPropertyOptional({ description: '服务时间点' })
  @IsString()
  serviceTime: string

  @ApiPropertyOptional({ description: '就诊地址' })
  @IsString()
  serviceAddress: string

  @ApiPropertyOptional({ description: '陪诊需求描述' })
  @IsOptional()
  @IsString()
  requirement?: string
}

// 更新订单状态 DTO
export class PzBookingUpdateStatusDto {
  @ApiPropertyOptional({ description: '订单状态' })
  @IsNumber()
  @IsIn([2, 3, 4, 5, 6])
  status: number

  @ApiPropertyOptional({ description: '取消原因（取消订单时）' })
  @IsOptional()
  @IsString()
  cancelReason?: string
}

// 取消订单 DTO
export class PzBookingCancelDto {
  @ApiPropertyOptional({ description: '取消原因' })
  @IsString()
  cancelReason: string
}

// 小程序提交陪诊订单 DTO
export class PzBookingSubmitDto {
  @ApiPropertyOptional({ description: '用户ID（小程序登录后获得）' })
  @IsNumber()
  userId: number

  @ApiPropertyOptional({ description: '陪诊师ID' })
  @IsNumber()
  advisorId: number

  @ApiPropertyOptional({ description: '就诊人姓名' })
  @IsString()
  patientName: string

  @ApiPropertyOptional({ description: '就诊人性别 1男 2女' })
  @IsNumber()
  @IsIn([1, 2])
  patientGender: number

  @ApiPropertyOptional({ description: '就诊人年龄' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  patientAge?: number

  @ApiPropertyOptional({ description: '就诊人手机号' })
  @IsString()
  patientPhone: string

  @ApiPropertyOptional({ description: '就诊人身份证' })
  @IsOptional()
  @IsString()
  patientIdCard?: string

  @ApiPropertyOptional({ description: '服务类型 1全程陪诊 2代办跑腿 3就医指导' })
  @IsNumber()
  @IsIn([1, 2, 3])
  serviceType: number

  @ApiPropertyOptional({ description: '服务时段 1上午 2下午 3晚上' })
  @IsNumber()
  @IsIn([1, 2, 3])
  servicePeriod: number

  @ApiPropertyOptional({ description: '服务日期' })
  @IsDateString()
  serviceDate: string

  @ApiPropertyOptional({ description: '服务时间点' })
  @IsString()
  serviceTime: string

  @ApiPropertyOptional({ description: '就诊地址' })
  @IsString()
  serviceAddress: string

  @ApiPropertyOptional({ description: '陪诊需求描述' })
  @IsOptional()
  @IsString()
  requirement?: string
}
