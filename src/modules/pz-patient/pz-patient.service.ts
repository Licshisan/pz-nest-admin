import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty, isNil } from 'lodash'
import { EntityManager, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { PzPatientDto, PzPatientQueryDto, PzPatientUpdateDto } from './dto/pz-patient.dto'
import { PzPatientEntity } from './pz-patient.entity'

@Injectable()
export class PzPatientService {
  constructor(
    @InjectRepository(PzPatientEntity)
    private readonly pzPatientRepository: Repository<PzPatientEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  /**
   * 获取就诊人详情
   */
  async info(id: number): Promise<PzPatientEntity> {
    const patient = await this.pzPatientRepository.findOneBy({ id })

    if (isEmpty(patient))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    return patient
  }

  /**
   * 获取就诊人列表
   */
  async list(dto: PzPatientQueryDto): Promise<Pagination<PzPatientEntity>> {
    const { page, pageSize, userId, isDefault } = dto

    const queryBuilder = this.pzPatientRepository
      .createQueryBuilder('patient')
      .where({
        ...(userId ? { userId } : null),
        ...(!isNil(isDefault) ? { isDefault } : null),
      })
      .orderBy('patient.isDefault', 'DESC')
      .addOrderBy('patient.createdAt', 'DESC')

    return paginate<PzPatientEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 获取用户的所有就诊人
   */
  async getUserPatients(userId: number): Promise<PzPatientEntity[]> {
    return this.pzPatientRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    })
  }

  /**
   * 获取用户的默认就诊人
   */
  async getDefaultPatient(userId: number): Promise<PzPatientEntity | undefined> {
    return this.pzPatientRepository.findOne({
      where: { userId, isDefault: 1 },
    })
  }

  /**
   * 创建就诊人
   */
  async create(userId: number, dto: PzPatientDto): Promise<PzPatientEntity> {
    // 如果设置为默认就诊人，先取消其他默认
    if (dto.isDefault === 1) {
      await this.pzPatientRepository.update({ userId, isDefault: 1 }, { isDefault: 0 })
    }

    const patient = await this.entityManager.transaction(async (manager) => {
      const newPatient = manager.create(PzPatientEntity, {
        userId,
        ...dto,
      })

      return manager.save(newPatient)
    })

    return patient
  }

  /**
   * 更新就诊人
   */
  async update(id: number, userId: number, dto: PzPatientUpdateDto): Promise<void> {
    const patient = await this.info(id)

    if (patient.userId !== userId) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    // 如果设置为默认就诊人，先取消其他默认
    if (dto.isDefault === 1) {
      await this.pzPatientRepository.update({ userId, isDefault: 1 }, { isDefault: 0 })
    }

    await this.entityManager.transaction(async (manager) => {
      await manager.update(PzPatientEntity, id, {
        ...dto,
      })
    })
  }

  /**
   * 删除就诊人
   */
  async delete(id: number, userId: number): Promise<void> {
    const patient = await this.info(id)

    if (patient.userId !== userId) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    await this.pzPatientRepository.delete(id)
  }

  /**
   * 设为默认就诊人
   */
  async setDefault(id: number, userId: number): Promise<void> {
    const patient = await this.info(id)

    if (patient.userId !== userId) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    // 取消其他默认
    await this.pzPatientRepository.update({ userId, isDefault: 1 }, { isDefault: 0 })

    // 设置当前为默认
    await this.pzPatientRepository.update(id, { isDefault: 1 })
  }
}
