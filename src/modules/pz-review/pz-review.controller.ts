import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { MiniappAuth } from '~/common/decorators/miniapp-auth.decorator'

import { MiniappUser } from '~/common/decorators/miniapp-user.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { PzReviewDto, PzReviewQueryDto } from './dto/pz-review.dto'
import { PzReviewEntity } from './pz-review.entity'
import { PzReviewService } from './pz-review.service'

export const permissions = definePermission('peizhen:review', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  DELETE: 'delete',
} as const)

@ApiTags('Peizhen - 评价模块')
@Controller('peizhen/reviews')
export class PzReviewController {
  constructor(private pzReviewService: PzReviewService) {}

  // 微信小程序接口
  @Post()
  @ApiOperation({ summary: '创建评价' })
  @ApiResult({ type: PzReviewEntity })
  @MiniappAuth()
  async create(@Body() dto: PzReviewDto, @MiniappUser() uid: number) {
    return this.pzReviewService.create(uid, dto)
  }

  @Get('advisor/:advisorId')
  @ApiOperation({ summary: '获取陪诊师的所有评价' })
  @ApiResult({ type: [PzReviewEntity] })
  @MiniappAuth()
  async getAdvisorReviews(@Param('advisorId') advisorId: number) {
    return this.pzReviewService.getAdvisorReviews(advisorId)
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: '获取订单的评价' })
  @ApiResult({ type: PzReviewEntity })
  @MiniappAuth()
  async getBookingReview(@Param('bookingId') bookingId: number) {
    return this.pzReviewService.getBookingReview(bookingId)
  }

  // 管理后台接口
  @Get()
  @ApiOperation({ summary: '获取评价列表' })
  @ApiResult({ type: [PzReviewEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzReviewQueryDto) {
    return this.pzReviewService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询评价详情' })
  @ApiResult({ type: PzReviewEntity })
  @Perm(permissions.READ)
  async read(@IdParam() id: number) {
    return this.pzReviewService.info(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评价' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.pzReviewService.delete(id)
  }
}
