import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { MiniappAuth } from '~/common/decorators/miniapp-auth.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'
import { PzServiceItemCreateDto, PzServiceItemQueryDto, ServiceType } from './dto/pz-service-item.dto'
import { PzServiceItemEntity } from './pz-service-item.entity'
import { PzServiceItemService } from './pz-service-item.service'

export const permissions = definePermission('peizhen:service-item', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Peizhen - 服务项管理')
@Controller('peizhen/service-items')
export class PzServiceItemController {
  constructor(private pzServiceItemService: PzServiceItemService) {}

  @Get('public')
  @ApiOperation({ summary: '获取公开服务列表（小程序使用）' })
  @ApiResult({ type: [PzServiceItemEntity] })
  @MiniappAuth()
  async findAll(@Query('serviceType') serviceType?: ServiceType) {
    return this.pzServiceItemService.findAll(serviceType)
  }

  @Get()
  @ApiOperation({ summary: '获取服务项列表' })
  @ApiResult({ type: [PzServiceItemEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzServiceItemQueryDto) {
    return this.pzServiceItemService.page(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询服务项详情' })
  @ApiResult({ type: PzServiceItemEntity })
  @Perm(permissions.READ)
  async read(@IdParam() id: number) {
    return this.pzServiceItemService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: '创建服务项' })
  @ApiResult({ type: PzServiceItemEntity })
  @Perm(permissions.CREATE)
  async create(@Body() dto: PzServiceItemCreateDto) {
    console.log('Received create request with data:', dto)
    return await this.pzServiceItemService.create(dto)
  }

  @Post(':id')
  @ApiOperation({ summary: '更新服务项' })
  @ApiResult({ type: PzServiceItemEntity })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: PzServiceItemCreateDto) {
    await this.pzServiceItemService.update(id, dto)
    return this.pzServiceItemService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除服务项' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.pzServiceItemService.delete(id)
  }
}
