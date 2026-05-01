import { Global, Module } from '@nestjs/common'
import { WechatMsgService } from './wechat-msg.service'

@Global()
@Module({
  providers: [WechatMsgService],
  exports: [WechatMsgService],
})
export class WechatMsgModule {}
