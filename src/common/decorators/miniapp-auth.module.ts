import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, ISecurityConfig } from '~/config'
import { isDev } from '~/global/env'

import { PzUserEntity } from '~/modules/pz-user/pz-user.entity'
import { MiniappAuthGuard } from './miniapp-auth.guard'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([PzUserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExprire } = configService.get<ISecurityConfig>('security')
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: `${jwtExprire}s` },
          ignoreExpiration: isDev,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MiniappAuthGuard],
  exports: [MiniappAuthGuard, TypeOrmModule, JwtModule],
})
export class MiniappAuthModule {}
