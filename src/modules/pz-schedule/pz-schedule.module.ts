import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PzScheduleController } from './pz-schedule.controller'
import { PzScheduleEntity } from './pz-schedule.entity'
import { PzScheduleService } from './pz-schedule.service'

const providers = [PzScheduleService]

@Module({
  imports: [TypeOrmModule.forFeature([PzScheduleEntity])],
  controllers: [PzScheduleController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzScheduleModule {}
