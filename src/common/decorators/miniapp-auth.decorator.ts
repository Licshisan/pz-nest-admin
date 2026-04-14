import { applyDecorators, UseGuards } from '@nestjs/common'

import { Public } from '~/modules/auth/decorators/public.decorator'
import { MiniappAuthGuard } from './miniapp-auth.guard'

/**
 * 标记当前路由为微信小程序接口
 *
 * 自动完成：
 * 1. @Public() — 跳过管理端全局 Auth Guard
 * 2. MiniappAuthGuard — 从 Authorization header 提取并验证小程序 JWT token
 *
 * 配合 @MiniappUser() 参数装饰器获取 uid
 *
 * @example
 * @MiniappAuth()
 * async updateProfile(@MiniappUser() uid: number) { ... }
 */
export function MiniappAuth() {
  return applyDecorators(
    Public(),
    UseGuards(MiniappAuthGuard),
  )
}
