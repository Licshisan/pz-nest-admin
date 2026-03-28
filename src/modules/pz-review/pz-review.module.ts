import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PzAdvisorModule } from '../pz-advisor/pz-advisor.module'
import { PzBookingModule } from '../pz-booking/pz-booking.module'
import { PzReviewController } from './pz-review.controller'
import { PzReviewEntity } from './pz-review.entity'
import { PzReviewService } from './pz-review.service'

const providers = [PzReviewService]

@Module({
  imports: [
    TypeOrmModule.forFeature([PzReviewEntity]),
    PzBookingModule,
    PzAdvisorModule,
  ],
  controllers: [PzReviewController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzReviewModule {}
