import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigKeyPaths, ISecurityConfig } from '~/config'
import { isDev } from '~/global/env'

import { PzUserController } from './pz-user.controller'
import { PzUserEntity } from './pz-user.entity'
import { PzUserService } from './pz-user.service'

const providers = [PzUserService]

@Module({
  imports: [
    TypeOrmModule.forFeature([PzUserEntity]),
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExprire }
          = configService.get<ISecurityConfig>('security')

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExprire}s`,
          },
          ignoreExpiration: isDev,
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [PzUserController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzUserModule {}
