import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PzAdvisorController } from './pz-advisor.controller'
import { PzAdvisorEntity } from './pz-advisor.entity'
import { PzAdvisorService } from './pz-advisor.service'

const providers = [PzAdvisorService]

@Module({
  imports: [TypeOrmModule.forFeature([PzAdvisorEntity])],
  controllers: [PzAdvisorController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzAdvisorModule {}
