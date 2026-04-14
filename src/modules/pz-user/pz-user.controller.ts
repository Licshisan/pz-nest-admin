import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, Req } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { MiniappAuth } from '~/common/decorators/miniapp-auth.decorator'
import { MiniappUser } from '~/common/decorators/miniapp-user.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { definePermission, Perm } from '../auth/decorators/permission.decorator'

import { UploadService } from '../tools/upload/upload.service'
import { PzUserDto, PzUserQueryDto, PzUserUpdateDto, PzUserUpdateProfileDto, WechatLoginDto } from './dto/pz-user.dto'
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
    private uploadService: UploadService,
  ) {}

  // ========================
  // 小程序接口
  // ========================

  @Post('wechat-login')
  @ApiOperation({ summary: '微信小程序登录' })
  @ApiResult({ type: PzUserEntity })
  @Public()
  async wechatLogin(@Body() dto: WechatLoginDto) {
    const { user, token } = await this.pzUserService.wechatLogin(dto)
    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      token,
    }
  }

  @Put('profile')
  @ApiOperation({ summary: '更新小程序用户资料（昵称、头像）' })
  @MiniappAuth()
  async updateProfile(
    @MiniappUser() uid: number,
    @Body() dto: PzUserUpdateProfileDto,
  ) {
    const user = await this.pzUserService.updateProfile(uid, dto)
    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
    }
  }

  @Post('avatar')
  @ApiOperation({ summary: '小程序用户上传头像' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '头像文件',
        },
      },
      required: ['file'],
    },
  })
  @MiniappAuth()
  async uploadAvatar(
    @MiniappUser() uid: number,
    @Req() req: FastifyRequest,
  ) {
    if (!req.isMultipart())
      throw new BadRequestException('请求不是 multipart 类型')

    const file = await req.file()

    try {
      return await this.uploadService.saveFile(file, uid)
    }
    catch (error) {
      throw new BadRequestException('头像上传失败')
    }
  }

  // ========================
  // 管理端接口
  // ========================
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
