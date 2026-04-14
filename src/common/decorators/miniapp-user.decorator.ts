import type { FastifyRequest } from 'fastify'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { MINIAPP_USER_KEY } from './miniapp-auth.guard'

/**
 * 从 request 中提取小程序用户 uid
 *
 * @example
 * async updateProfile(@MiniappUser() uid: number) { ... }
 */
export const MiniappUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>()
    const miniappUser = (request as any)[MINIAPP_USER_KEY]
    return miniappUser?.uid
  },
)
