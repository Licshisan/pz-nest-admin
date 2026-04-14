import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'
import { PzBookingCancelDto, PzBookingCreateDto, PzBookingQueryDto, PzBookingSubmitDto, PzBookingUpdateStatusDto } from './dto/pz-booking.dto'
import { BookingStatus, PzBookingEntity } from './pz-booking.entity'
import { PzBookingService } from './pz-booking.service'

export const permissions = definePermission('peizhen:booking', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Peizhen - 订单模块')
@Controller('peizhen/bookings')
export class PzBookingController {
  constructor(private pzBookingService: PzBookingService) {}

  // 小程序接口
  @Get('my')
  @ApiOperation({ summary: '获取我的订单列表' })
  @ApiResult({ type: [PzBookingEntity] })
  @Public()
  async getMyBookings(@Query('status') status?: BookingStatus, @Req() req?) {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    return this.pzBookingService.getUserBookings(userId, status)
  }

  @Get('order-no/:orderNo')
  @ApiOperation({ summary: '根据订单号查询订单详情（小程序专用）' })
  @ApiResult({ type: PzBookingEntity })
  @Public()
  async findByOrderNo(@Param('orderNo') orderNo: string) {
    return this.pzBookingService.findByOrderNo(orderNo)
  }

  @Post('submit')
  @ApiOperation({ summary: '提交陪诊订单' })
  @ApiResult({ type: PzBookingEntity })
  @Public()
  async submit(@Body() dto: PzBookingSubmitDto) {
    return this.pzBookingService.submit(dto)
  }

  @Post('cancel/:id')
  @ApiOperation({ summary: '取消订单（小程序专用）' })
  @Public()
  async cancel(@Param('id') id: number, @Body() dto: PzBookingCancelDto, @Req() req?) {
    const userId = req?.user?.id || 1
    await this.pzBookingService.cancel(id, dto, userId)
  }

  // 管理端
  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  @ApiResult({ type: [PzBookingEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzBookingQueryDto) {
    return this.pzBookingService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询订单详情' })
  @ApiResult({ type: PzBookingEntity })
  @Perm(permissions.READ)
  async read(@IdParam() id: number) {
    return this.pzBookingService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '新增订单' })
  @ApiResult({ type: PzBookingEntity })
  @Perm(permissions.CREATE)
  async create(@Body() dto: PzBookingCreateDto, @Req() req?) {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    return this.pzBookingService.create(userId, dto)
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新订单' })
  @Perm(permissions.UPDATE)
  async updateStatus(@IdParam() id: number, @Body() dto: PzBookingUpdateStatusDto): Promise<void> {
    await this.pzBookingService.updateStatus(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除订单' })
  @ApiParam({ name: 'id', type: String, schema: { oneOf: [{ type: 'string' }, { type: 'number' }] } })
  @Perm(permissions.DELETE)
  async delete(@Param('id', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]): Promise<void> {
    await this.pzBookingService.delete(ids)
  }
}
