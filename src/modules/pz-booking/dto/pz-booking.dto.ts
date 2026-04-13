import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { BookingStatus, PatientGender, ServicePeriod, ServiceType } from '../pz-booking.entity'

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

  @ApiPropertyOptional({ description: '订单状态', enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus

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

  @ApiPropertyOptional({ description: '就诊人性别', enum: PatientGender })
  @IsEnum(PatientGender)
  patientGender: PatientGender

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

  @ApiPropertyOptional({ description: '服务类型', enum: ServiceType })
  @IsEnum(ServiceType)
  serviceType: ServiceType

  @ApiPropertyOptional({ description: '服务时段', enum: ServicePeriod })
  @IsEnum(ServicePeriod)
  servicePeriod: ServicePeriod

  @ApiPropertyOptional({ description: '服务时长（小时）1/2/4/8' })
  @IsOptional()
  @IsNumber()
  duration?: number

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
  @ApiPropertyOptional({ description: '订单状态', enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus

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

  @ApiPropertyOptional({ description: '就诊人性别', enum: PatientGender })
  @IsEnum(PatientGender)
  patientGender: PatientGender

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

  @ApiPropertyOptional({ description: '服务类型', enum: ServiceType })
  @IsEnum(ServiceType)
  serviceType: ServiceType

  @ApiPropertyOptional({ description: '服务时段', enum: ServicePeriod })
  @IsEnum(ServicePeriod)
  servicePeriod: ServicePeriod

  @ApiPropertyOptional({ description: '服务时长（小时）1/2/4/8' })
  @IsOptional()
  @IsNumber()
  duration?: number

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
