import { Body, Controller, Delete, Get, Post, Put, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'
import { PzPatientDto, PzPatientQueryDto, PzPatientUpdateDto } from './dto/pz-patient.dto'
import { PzPatientEntity } from './pz-patient.entity'
import { PzPatientService } from './pz-patient.service'

export const permissions = definePermission('peizhen:patient', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Peizhen - 就诊人模块')
@Controller('peizhen/patients')
export class PzPatientController {
  constructor(private pzPatientService: PzPatientService) {}

  @Get()
  @ApiOperation({ summary: '获取就诊人列表' })
  @ApiResult({ type: [PzPatientEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzPatientQueryDto) {
    return this.pzPatientService.list(dto)
  }

  @Get('my')
  @ApiOperation({ summary: '获取我的就诊人列表' })
  @ApiResult({ type: [PzPatientEntity] })
  @Public()
  async getMyPatients(@Req() req?) {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    return this.pzPatientService.getUserPatients(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询就诊人详情' })
  @ApiResult({ type: PzPatientEntity })
  @Public()
  async read(@IdParam() id: number) {
    return this.pzPatientService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '新增就诊人' })
  @ApiResult({ type: PzPatientEntity })
  @Public()
  async create(@Body() dto: PzPatientDto, @Req() req?) {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    return this.pzPatientService.create(userId, dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新就诊人' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: PzPatientUpdateDto, @Req() req?): Promise<void> {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    await this.pzPatientService.update(id, userId, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除就诊人' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number, @Req() req?): Promise<void> {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    await this.pzPatientService.delete(id, userId)
  }

  @Put(':id/default')
  @ApiOperation({ summary: '设为默认就诊人' })
  @Public()
  async setDefault(@IdParam() id: number, @Req() req?): Promise<void> {
    const userId = req?.user?.id || 1 // TODO: 从JWT获取用户ID
    await this.pzPatientService.setDefault(id, userId)
  }
}
