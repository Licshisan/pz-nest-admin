import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UploadModule } from '../tools/upload/upload.module'
import { PzUserController } from './pz-user.controller'
import { PzUserEntity } from './pz-user.entity'
import { PzUserService } from './pz-user.service'

const providers = [PzUserService]

@Module({
  imports: [
    TypeOrmModule.forFeature([PzUserEntity]),
    HttpModule,
    UploadModule,
  ],
  controllers: [PzUserController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzUserModule {}
