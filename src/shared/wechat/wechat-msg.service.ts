import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

import { IWechatConfig, WechatConfig } from '~/config'
import { CacheService } from '~/shared/redis/cache.service'

// 订阅消息模板 ID
export const WX_SUBSCRIBE_TEMPLATE = {
  /** 确认接单通知 */
  ORDER_ACCEPTED: 'fc2Rhr_9pGkDRam3PAfjiVSLqNBKgohgb9lbAxAlKz4',
  /** 确认完成通知 */
  ORDER_COMPLETED: 'q4EdvEI5b-UqhXvQ0tC_moPc-77slqlnxi90_d88rMA',
} as const

// access_token 缓存 key 和过期时间
const ACCESS_TOKEN_CACHE_KEY = 'wechat:access_token'
const ACCESS_TOKEN_TTL_MS = 7100 * 1000 // 提前 100s 过期，保证有效

interface SubscribeMsgData {
  [key: string]: { value: string }
}

@Injectable()
export class WechatMsgService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService,
    @Inject(WechatConfig.KEY) private wechatConfig: IWechatConfig,
  ) {}

  /**
   * 获取微信 access_token（带 Redis 缓存，有效期 2 小时）
   */
  private async getAccessToken(): Promise<string> {
    // 先从缓存读取
    const cached = await this.cacheService.get<string>(ACCESS_TOKEN_CACHE_KEY)
    if (cached)
      return cached

    const { miniAppId, miniAppSecret } = this.wechatConfig
    const url = 'https://api.weixin.qq.com/cgi-bin/token'
    const params = {
      grant_type: 'client_credential',
      appid: miniAppId,
      secret: miniAppSecret,
    }

    const { data } = await firstValueFrom(this.httpService.get(url, { params }))
    if (!data.access_token)
      throw new Error(`获取 access_token 失败: ${data.errmsg || JSON.stringify(data)}`)

    // 缓存到 Redis
    await this.cacheService.set(ACCESS_TOKEN_CACHE_KEY, data.access_token, ACCESS_TOKEN_TTL_MS)

    return data.access_token
  }

  /**
   * 发送微信订阅消息
   * @param params 订阅消息参数
   * @param params.openid 用户 openid
   * @param params.templateId 模板 ID
   * @param params.page 用户点击消息后跳转的页面路径
   * @param params.data 模板数据
   */
  async sendSubscribeMessage(params: {
    openid: string
    templateId: string
    page?: string
    data: SubscribeMsgData
  }): Promise<void> {
    const { openid, templateId, page, data } = params

    try {
      const accessToken = await this.getAccessToken()
      const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`

      const payload = {
        touser: openid,
        template_id: templateId,
        page: page || 'pages/my-bookings/my-bookings',
        data,
      }

      const { data: result } = await firstValueFrom(this.httpService.post(url, payload))

      if (result.errcode && result.errcode !== 0) {
        // errcode 43101 表示用户拒绝接收此模板消息，记录但不抛异常
        if (result.errcode === 43101) {
          console.warn(`[WechatMsg] 用户 ${openid} 拒绝接收模板消息 ${templateId}`)
          return
        }
        console.error(`[WechatMsg] 发送失败: ${JSON.stringify(result)}`)
        throw new Error(`发送订阅消息失败: ${result.errmsg || result.errcode}`)
      }

      console.log(`[WechatMsg] 发送成功 to ${openid}, template ${templateId}`)
    }
    catch (error) {
      // 记录日志，不影响主业务
      console.error(`[WechatMsg] 发送订阅消息异常:`, error)
    }
  }
}
