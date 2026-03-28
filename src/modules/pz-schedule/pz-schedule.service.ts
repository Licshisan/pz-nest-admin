import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty, isNil } from 'lodash'
import { EntityManager, MoreThanOrEqual, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { PzScheduleBatchDto, PzScheduleDto, PzScheduleQueryDto, PzScheduleUpdateDto } from './dto/pz-schedule.dto'
import { PzScheduleEntity } from './pz-schedule.entity'

@Injectable()
export class PzScheduleService {
  constructor(
    @InjectRepository(PzScheduleEntity)
    private readonly pzScheduleRepository: Repository<PzScheduleEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  /**
   * 获取排班详情
   */
  async info(id: number): Promise<PzScheduleEntity> {
    const schedule = await this.pzScheduleRepository.findOneBy({ id })

    if (isEmpty(schedule))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    return schedule
  }

  /**
   * 获取排班列表
   */
  async list(dto: PzScheduleQueryDto): Promise<Pagination<PzScheduleEntity>> {
    const { page, pageSize, advisorId, scheduleDate, period, isAvailable } = dto

    const queryBuilder = this.pzScheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.advisor', 'advisor')
      .where({
        ...(advisorId ? { advisorId } : null),
        ...(period ? { period } : null),
        ...(!isNil(isAvailable) ? { isAvailable } : null),
        ...(scheduleDate ? { scheduleDate: new Date(scheduleDate) } : null),
      })
      .orderBy('schedule.scheduleDate', 'ASC')
      .addOrderBy('schedule.period', 'ASC')

    return paginate<PzScheduleEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 获取陪诊师的可用排班
   */
  async getAvailableSchedules(advisorId: number, date?: string): Promise<PzScheduleEntity[]> {
    const where: any = {
      advisorId,
      isAvailable: 1,
    }

    if (date) {
      where.scheduleDate = new Date(date)
    }
    else {
      // 只返回今天及以后的排班
      where.scheduleDate = MoreThanOrEqual(new Date())
    }

    return this.pzScheduleRepository.find({
      where,
      order: {
        scheduleDate: 'ASC',
        period: 'ASC',
      },
    })
  }

  /**
   * 获取陪诊师某天的排班
   */
  async getSchedulesByDate(advisorId: number, date: string): Promise<PzScheduleEntity[]> {
    return this.pzScheduleRepository.find({
      where: {
        advisorId,
        scheduleDate: new Date(date),
        isAvailable: 1,
      },
      order: { period: 'ASC' },
    })
  }

  /**
   * 创建排班
   */
  async create(dto: PzScheduleDto): Promise<PzScheduleEntity> {
    // 检查是否已存在相同的排班
    const exists = await this.pzScheduleRepository.findOneBy({
      advisorId: dto.advisorId,
      scheduleDate: new Date(dto.scheduleDate),
      period: dto.period,
    })

    if (!isEmpty(exists)) {
      throw new BusinessException('该时段排班已存在')
    }

    const schedule = await this.entityManager.transaction(async (manager) => {
      const newSchedule = manager.create(PzScheduleEntity, {
        ...dto,
        scheduleDate: new Date(dto.scheduleDate),
        maxBookings: dto.maxBookings || 3,
        currentBookings: 0,
        isAvailable: 1,
      })

      return manager.save(newSchedule)
    })

    return schedule
  }

  /**
   * 批量创建排班
   */
  async createBatch(dto: PzScheduleBatchDto): Promise<void> {
    const startDate = new Date(dto.startDate)
    const endDate = new Date(dto.endDate)
    const maxBookings = dto.maxBookings || 3

    await this.entityManager.transaction(async (manager) => {
      const currentDate = new Date(startDate)

      while (currentDate.getTime() <= endDate.getTime()) {
        for (const period of dto.periods) {
          // 检查是否已存在
          const exists = await manager.findOne(PzScheduleEntity, {
            where: {
              advisorId: dto.advisorId,
              scheduleDate: new Date(currentDate),
              period,
            },
          })

          if (isEmpty(exists)) {
            const schedule = manager.create(PzScheduleEntity, {
              advisorId: dto.advisorId,
              scheduleDate: new Date(currentDate),
              period,
              timeSlots: dto.timeSlots,
              maxBookings,
              currentBookings: 0,
              isAvailable: 1,
            })

            await manager.save(schedule)
          }
        }

        // 日期+1
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })
  }

  /**
   * 更新排班
   */
  async update(id: number, dto: PzScheduleUpdateDto): Promise<void> {
    const exists = await this.info(id)
    if (isEmpty(exists))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    await this.entityManager.transaction(async (manager) => {
      await manager.update(PzScheduleEntity, id, {
        ...dto,
      })
    })
  }

  /**
   * 删除排班
   */
  async delete(ids: number[]): Promise<void> {
    await this.pzScheduleRepository.delete(ids)
  }

  /**
   * 增加当前预约数
   */
  async incrementCurrentBookings(id: number): Promise<void> {
    await this.pzScheduleRepository.increment({ id }, 'currentBookings', 1)
  }

  /**
   * 减少当前预约数
   */
  async decrementCurrentBookings(id: number): Promise<void> {
    await this.pzScheduleRepository.decrement({ id }, 'currentBookings', 1)
  }

  /**
   * 检查时段是否可预约
   */
  async checkAvailable(advisorId: number, date: string, period: number, time: string): Promise<boolean> {
    const schedule = await this.pzScheduleRepository.findOneBy({
      advisorId,
      scheduleDate: new Date(date),
      period,
    })

    if (isEmpty(schedule) || schedule.isAvailable === 0) {
      return false
    }

    if (schedule.currentBookings >= schedule.maxBookings) {
      return false
    }

    return schedule.timeSlots.includes(time)
  }
}
