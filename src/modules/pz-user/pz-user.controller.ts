import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'
import { PzUserDto, PzUserQueryDto, PzUserUpdateDto } from './dto/pz-user.dto'
import { WechatLoginDto, WechatPhoneDto } from './dto/wechat-auth.dto'
import { PzUserEntity } from './pz-user.entity'
import { PzUserService } from './pz-user.service'

export const permissions = definePermission('peizhen:user', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@Public()
@ApiTags('Peizhen - 微信用户模块')
@Controller('peizhen/users')
export class PzUserController {
  constructor(private pzUserService: PzUserService) {}

  @Post('wechat-login')
  @ApiOperation({ summary: '微信小程序登录' })
  @ApiResult({ type: PzUserEntity })
  async wechatLogin(@Body() dto: WechatLoginDto) {
    // TODO: 实际需要调用微信API获取openid
    // 这里简化为直接使用code作为openid演示
    const openid = dto.code // 实际应调用微信接口
    const { user, isNew } = await this.pzUserService.wechatLogin(openid)
    return {
      user,
      isNew,
      // TODO: 生成JWT token返回
      token: `mock-token-${user.id}`,
    }
  }

  @Post('wechat-phone')
  @ApiOperation({ summary: '获取微信用户手机号' })
  @Public()
  async getWechatPhone(@Body() dto: WechatPhoneDto) {
    // TODO: 实际需要调用微信API解密获取手机号
    // 这里简化为直接返回
    return {
      phone: '13800000000', // 实际应调用微信接口解密获取
    }
  }

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
