import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'
import { PzAdvisorDto, PzAdvisorQueryDto, PzAdvisorUpdateDto } from './dto/pz-advisor.dto'
import { PzAdvisorEntity } from './pz-advisor.entity'
import { PzAdvisorService } from './pz-advisor.service'

export const permissions = definePermission('peizhen:advisor', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Peizhen - 陪诊师模块')
@Controller('peizhen/advisors')
export class PzAdvisorController {
  constructor(private pzAdvisorService: PzAdvisorService) {}

  @Get()
  @ApiOperation({ summary: '获取陪诊师列表' })
  @ApiResult({ type: [PzAdvisorEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzAdvisorQueryDto) {
    return this.pzAdvisorService.list(dto)
  }

  @Get('available')
  @ApiOperation({ summary: '获取可预约的陪诊师列表' })
  @ApiResult({ type: [PzAdvisorEntity] })
  @Public()
  async getAvailable() {
    return this.pzAdvisorService.getAvailableAdvisors()
  }

  @Get(':id')
  @ApiOperation({ summary: '查询陪诊师详情' })
  @ApiResult({ type: PzAdvisorEntity })
  @Public()
  async read(@IdParam() id: number) {
    return this.pzAdvisorService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '新增陪诊师' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: PzAdvisorDto): Promise<void> {
    await this.pzAdvisorService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新陪诊师' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: PzAdvisorUpdateDto): Promise<void> {
    await this.pzAdvisorService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除陪诊师' })
  @ApiParam({ name: 'id', type: String, schema: { oneOf: [{ type: 'string' }, { type: 'number' }] } })
  @Perm(permissions.DELETE)
  async delete(@Param('id', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]): Promise<void> {
    await this.pzAdvisorService.delete(ids)
  }
}
