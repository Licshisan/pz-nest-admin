import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'
import { PzUserDto, PzUserQueryDto, PzUserUpdateDto, WechatLoginDto } from './dto/pz-user.dto'
import { PzUserEntity } from './pz-user.entity'
import { PzUserService } from './pz-user.service'

export const permissions = definePermission('peizhen:user', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Peizhen - 微信用户模块')
@Controller('peizhen/users')
export class PzUserController {
  constructor(
    private pzUserService: PzUserService,
  ) {}

  // 小程序接口
  @Post('wechat-login')
  @ApiOperation({ summary: '微信小程序静默登录' })
  @ApiResult({ type: PzUserEntity })
  @Public()
  async wechatLogin(@Body() dto: WechatLoginDto) {
    return this.pzUserService.wechatLogin(dto)
  }

  // 管理端接口
  @Get()
  @ApiOperation({ summary: '获取微信用户列表' })
  @ApiResult({ type: [PzUserEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: PzUserQueryDto) {
    return this.pzUserService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询微信用户详情' })
  @Perm(permissions.READ)
  async read(@IdParam() id: number) {
    return this.pzUserService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '新增微信用户' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: PzUserDto): Promise<void> {
    await this.pzUserService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新微信用户' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() dto: PzUserUpdateDto): Promise<void> {
    await this.pzUserService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除微信用户' })
  @ApiParam({ name: 'id', type: String, schema: { oneOf: [{ type: 'string' }, { type: 'number' }] } })
  @Perm(permissions.DELETE)
  async delete(@Param('id', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]): Promise<void> {
    await this.pzUserService.delete(ids)
  }
}
