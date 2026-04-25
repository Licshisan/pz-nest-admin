import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PzServiceItemController } from './pz-service-item.controller'
import { PzServiceItemEntity } from './pz-service-item.entity'
import { PzServiceItemService } from './pz-service-item.service'

const providers = [PzServiceItemService]

@Module({
  imports: [TypeOrmModule.forFeature([PzServiceItemEntity])],
  controllers: [PzServiceItemController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzServiceItemModule {}
