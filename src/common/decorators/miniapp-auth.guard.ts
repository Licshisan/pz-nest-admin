import type { ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { FastifyRequest } from 'fastify'
import { isEmpty } from 'lodash'
import { Repository } from 'typeorm'

import { PzUserEntity, UserStatus } from '~/modules/pz-user/pz-user.entity'

export const MINIAPP_USER_KEY = 'miniapp_user'

@Injectable()
export class MiniappAuthGuard {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(PzUserEntity)
    private readonly pzUserRepository: Repository<PzUserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const token = this.extractBearerToken(request.headers.authorization)

    const uid = await this.verifyToken(token)

    // 将 uid 挂载到 request 上，供 @MiniappUser() 装饰器读取
    ;(request as any)[MINIAPP_USER_KEY] = { uid }

    return true
  }

  private extractBearerToken(authorization: string | undefined): string {
    if (!authorization || !authorization.startsWith('Bearer '))
      throw new UnauthorizedException('请先登录')

    return authorization.slice(7)
  }

  private async verifyToken(token: string): Promise<number> {
    let payload: any
    try {
      payload = await this.jwtService.verifyAsync(token)
    }
    catch {
      throw new UnauthorizedException('token 已过期或无效')
    }

    if (!payload?.uid || payload.type !== 'miniapp')
      throw new UnauthorizedException('无效的小程序 token')

    const user = await this.pzUserRepository.findOneBy({ id: payload.uid })
    if (isEmpty(user) || user.status === UserStatus.DISABLED)
      throw new UnauthorizedException('用户不存在或已被禁用')

    return payload.uid
  }
}
