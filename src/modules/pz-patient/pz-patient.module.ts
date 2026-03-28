import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PzPatientController } from './pz-patient.controller'
import { PzPatientEntity } from './pz-patient.entity'
import { PzPatientService } from './pz-patient.service'

const providers = [PzPatientService]

@Module({
  imports: [TypeOrmModule.forFeature([PzPatientEntity])],
  controllers: [PzPatientController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class PzPatientModule {}
