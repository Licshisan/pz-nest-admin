import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty, isNil } from 'lodash'
import { EntityManager, Like, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { PzAdvisorDto, PzAdvisorQueryDto, PzAdvisorUpdateDto } from './dto/pz-advisor.dto'
import { AdvisorStatus, PzAdvisorEntity } from './pz-advisor.entity'

@Injectable()
export class PzAdvisorService {
  constructor(
    @InjectRepository(PzAdvisorEntity)
    private readonly pzAdvisorRepository: Repository<PzAdvisorEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  /**
   * 获取可预约的陪诊师列表
   */
  async getAvailableAdvisors(): Promise<PzAdvisorEntity[]> {
    return this.pzAdvisorRepository.find({
      where: {
        status: AdvisorStatus.ON_DUTY,
      },
      order: {
        rate: 'DESC',
        serviceCount: 'DESC',
      },
    })
  }

  /**
   * 获取陪诊师详情
   */
  async info(id: number): Promise<PzAdvisorEntity> {
    const advisor = await this.pzAdvisorRepository.findOneBy({ id })

    if (isEmpty(advisor))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    return advisor
  }

  /**
   * 获取陪诊师列表（可预约的）
   */
  async list(dto: PzAdvisorQueryDto): Promise<Pagination<PzAdvisorEntity>> {
    const { page, pageSize, name, status } = dto

    const queryBuilder = this.pzAdvisorRepository
      .createQueryBuilder('advisor')
      .where({
        ...(name ? { name: Like(`%${name}%`) } : null),
        ...(!isNil(status) ? { status } : null),
      })
      .orderBy('advisor.rate', 'DESC')
      .addOrderBy('advisor.serviceCount', 'DESC')

    return paginate<PzAdvisorEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 创建陪诊师
   */
  async create(dto: PzAdvisorDto): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      const advisor = manager.create(PzAdvisorEntity, {
        ...dto,
        status: AdvisorStatus.OFF_DUTY,
        rate: 5.0,
        serviceCount: 0,
      })

      await manager.save(advisor)
    })
  }

  /**
   * 更新陪诊师
   */
  async update(id: number, dto: PzAdvisorUpdateDto): Promise<void> {
    const exists = await this.pzAdvisorRepository.findOneBy({ id })
    if (isEmpty(exists))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    await this.entityManager.transaction(async (manager) => {
      await manager.update(PzAdvisorEntity, id, {
        ...dto,
      })
    })
  }

  /**
   * 删除陪诊师
   */
  async delete(ids: number[]): Promise<void> {
    await this.pzAdvisorRepository.delete(ids)
  }

  /**
   * 更新评分
   */
  async updateRating(id: number, rating: number): Promise<void> {
    const advisor = await this.info(id)
    // 计算新的平均评分
    const newRate = (advisor.rate * advisor.serviceCount + rating) / (advisor.serviceCount + 1)

    await this.pzAdvisorRepository.update(id, {
      rate: Number(newRate.toFixed(1)),
      serviceCount: advisor.serviceCount + 1,
    })
  }

  /**
   * 更新服务次数
   */
  async incrementServiceCount(id: number): Promise<void> {
    await this.pzAdvisorRepository.increment({ id }, 'serviceCount', 1)
  }
}
