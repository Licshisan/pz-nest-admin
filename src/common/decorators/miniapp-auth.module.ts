import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, ISecurityConfig } from '~/config'

import { PzUserEntity } from '~/modules/pz-user/pz-user.entity'
import { MiniappAuthGuard } from './miniapp-auth.guard'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([PzUserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret } = configService.get<ISecurityConfig>('security')
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '30d' }, // 小程序 token 设置30天过期
          ignoreExpiration: false, // 生产环境也检查过期时间
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MiniappAuthGuard],
  exports: [MiniappAuthGuard, TypeOrmModule, JwtModule],
})
export class MiniappAuthModule {}
