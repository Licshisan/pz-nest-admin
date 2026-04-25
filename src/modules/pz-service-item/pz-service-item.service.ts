import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty, isNil } from 'lodash'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { PzServiceItemCreateDto, PzServiceItemQueryDto, ServiceType } from './dto/pz-service-item.dto'
import { PzServiceItemEntity } from './pz-service-item.entity'

@Injectable()
export class PzServiceItemService {
  constructor(
    @InjectRepository(PzServiceItemEntity)
    private readonly pzServiceItemRepository: Repository<PzServiceItemEntity>,
  ) {}

  /**
   * 获取服务项详情
   */
  async findOne(id: number): Promise<PzServiceItemEntity> {
    const item = await this.pzServiceItemRepository.findOneBy({ id })

    if (isEmpty(item))
      throw new BusinessException('服务项不存在')

    return item
  }

  /**
   * 获取服务项列表
   */
  async page(dto: PzServiceItemQueryDto): Promise<Pagination<PzServiceItemEntity>> {
    const { page, pageSize, serviceType, name, status } = dto

    const queryBuilder = this.pzServiceItemRepository
      .createQueryBuilder('item')
      .where({
        ...(serviceType ? { serviceType } : null),
        ...(name ? { name: `%${name}%` } : null),
        ...(isNil(status) ? null : { status }),
      })
      .orderBy('item.sort', 'ASC')
      .addOrderBy('item.id', 'ASC')

    return paginate<PzServiceItemEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 获取所有启用的服务项
   */
  async findAll(serviceType?: ServiceType): Promise<PzServiceItemEntity[]> {
    const queryBuilder = this.pzServiceItemRepository
      .createQueryBuilder('item')
      .where({ status: 1 })
      .orderBy('item.sort', 'ASC')
      .addOrderBy('item.id', 'ASC')

    if (serviceType) {
      queryBuilder.andWhere({ serviceType })
    }

    return queryBuilder.getMany()
  }

  /**
   * 创建服务项
   */
  async create(dto: PzServiceItemCreateDto): Promise<void> {
    console.log('Creating service item with data:', dto)
    await this.pzServiceItemRepository.insert({
      ...dto,
    })
  }

  /**
   * 更新服务项
   */
  async update(id: number, dto: PzServiceItemCreateDto): Promise<void> {
    await this.pzServiceItemRepository.update(id, dto)
  }

  /**
   * 删除服务项
   */
  async delete(id: number): Promise<void> {
    await this.pzServiceItemRepository.delete(id)
  }

  /**
   * 查找服务项价格（供 PzBookingService 使用）
   */
  async findPrice(id: number): Promise<number> {
    const item = await this.findOne(id)
    if (item.status !== 1) {
      throw new BusinessException('服务项已下架')
    }
    return item.price
  }
}
