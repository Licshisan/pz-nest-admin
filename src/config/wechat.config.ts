import { ConfigType, registerAs } from '@nestjs/config'

import { env } from '~/global/env'

export const wechatRegToken = 'wechat'

export const WechatConfig = registerAs(wechatRegToken, () => ({
  // 微信小程序 AppID
  miniAppId: env('WECHAT_MINI_APPID'),
  // 微信小程序 AppSecret
  miniAppSecret: env('WECHAT_MINI_SECRET'),
}))

export type IWechatConfig = ConfigType<typeof WechatConfig>
