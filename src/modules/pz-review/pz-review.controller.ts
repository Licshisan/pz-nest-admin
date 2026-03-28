import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'
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

  @Get()
  @ApiOperation({ summary: '获取评价列表' })
  @ApiResult({ type: [PzReviewEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzReviewQueryDto) {
    return this.pzReviewService.list(dto)
  }

  @Get('advisor/:advisorId')
  @ApiOperation({ summary: '获取陪诊师的所有评价' })
  @ApiResult({ type: [PzReviewEntity] })
  @Public()
  async getAdvisorReviews(@Param('advisorId') advisorId: number) {
    return this.pzReviewService.getAdvisorReviews(advisorId)
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: '获取订单的评价' })
  @ApiResult({ type: PzReviewEntity })
  @Public()
  async getBookingReview(@Param('bookingId') bookingId: number) {
    return this.pzReviewService.getBookingReview(bookingId)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询评价详情' })
  @ApiResult({ type: PzReviewEntity })
  @Public()
  async read(@IdParam() id: number) {
    return this.pzReviewService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '创建评价' })
  @ApiResult({ type: PzReviewEntity })
  @Public()
  async create(@Body() dto: PzReviewDto, @Req() req?) {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    return this.pzReviewService.create(userId, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评价' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.pzReviewService.delete(id)
  }
}
