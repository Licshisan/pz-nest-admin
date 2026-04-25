import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PzAdvisorModule } from '../pz-advisor/pz-advisor.module'
import { PzServiceItemModule } from '../pz-service-item/pz-service-item.module'
import { PzBookingController } from './pz-booking.controller'
import { PzBookingEntity } from './pz-booking.entity'
import { PzBookingService } from './pz-booking.service'

const providers = [PzBookingService]

@Module({
  imports: [
    TypeOrmModule.forFeature([PzBookingEntity]),
    PzAdvisorModule,
    PzServiceItemModule,
  ],
  controllers: [PzBookingController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzBookingModule {}
