import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'
import { PzScheduleBatchDto, PzScheduleDto, PzScheduleQueryDto, PzScheduleUpdateDto } from './dto/pz-schedule.dto'
import { PzScheduleEntity } from './pz-schedule.entity'
import { PzScheduleService } from './pz-schedule.service'

export const permissions = definePermission('peizhen:schedule', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Peizhen - 排班模块')
@Controller('peizhen/schedules')
export class PzScheduleController {
  constructor(private pzScheduleService: PzScheduleService) {}

  @Get()
  @ApiOperation({ summary: '获取排班列表' })
  @ApiResult({ type: [PzScheduleEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzScheduleQueryDto) {
    return this.pzScheduleService.list(dto)
  }

  @Get('advisor/:advisorId')
  @ApiOperation({ summary: '获取陪诊师的可用排班' })
  @ApiResult({ type: [PzScheduleEntity] })
  @Public()
  async getAvailableSchedules(
    @Param('advisorId') advisorId: number,
    @Query('date') date?: string,
  ) {
    return this.pzScheduleService.getAvailableSchedules(advisorId, date)
  }

  @Get('advisor/:advisorId/date/:date')
  @ApiOperation({ summary: '获取陪诊师某天的排班' })
  @ApiResult({ type: [PzScheduleEntity] })
  @Public()
  async getSchedulesByDate(
    @Param('advisorId') advisorId: number,
    @Param('date') date: string,
  ) {
    return this.pzScheduleService.getSchedulesByDate(advisorId, date)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询排班详情' })
  @ApiResult({ type: PzScheduleEntity })
  @Public()
  async read(@IdParam() id: number) {
    return this.pzScheduleService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '创建排班' })
  @ApiResult({ type: PzScheduleEntity })
  @Perm(permissions.CREATE)
  async create(@Body() dto: PzScheduleDto) {
    return this.pzScheduleService.create(dto)
  }

  @Post('batch')
  @ApiOperation({ summary: '批量创建排班' })
  @Perm(permissions.CREATE)
  async createBatch(@Body() dto: PzScheduleBatchDto): Promise<void> {
    await this.pzScheduleService.createBatch(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新排班' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: PzScheduleUpdateDto): Promise<void> {
    await this.pzScheduleService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除排班' })
  @ApiParam({ name: 'id', type: String, schema: { oneOf: [{ type: 'string' }, { type: 'number' }] } })
  @Perm(permissions.DELETE)
  async delete(@Param('id', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]): Promise<void> {
    await this.pzScheduleService.delete(ids)
  }
}
