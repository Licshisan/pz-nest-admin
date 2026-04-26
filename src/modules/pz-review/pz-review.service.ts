import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { EntityManager, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { PzAdvisorService } from '../pz-advisor/pz-advisor.service'
import { BookingStatus } from '../pz-booking/pz-booking.entity'
import { PzBookingService } from '../pz-booking/pz-booking.service'
import { PzReviewDto, PzReviewQueryDto } from './dto/pz-review.dto'
import { PzReviewEntity } from './pz-review.entity'

@Injectable()
export class PzReviewService {
  constructor(
    @InjectRepository(PzReviewEntity)
    private readonly pzReviewRepository: Repository<PzReviewEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
    private pzBookingService: PzBookingService,
    private pzAdvisorService: PzAdvisorService,
  ) {}

  /**
   * 创建评价
   */
  async create(userId: number, dto: PzReviewDto): Promise<PzReviewEntity> {
    // 验证订单是否存在
    const booking = await this.pzBookingService.info(dto.bookingId)

    // 验证是否是订单所有者
    if (booking.userId !== userId) {
      throw new BusinessException('您无权评价此订单')
    }

    // 验证订单是否已完成
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BusinessException('只有已完成的订单才能评价')
    }

    // 检查是否已评价
    const existingReview = await this.getBookingReview(dto.bookingId)
    if (!isEmpty(existingReview)) {
      throw new BusinessException('该订单已评价')
    }

    const review = await this.entityManager.transaction(async (manager) => {
      const newReview = manager.create(PzReviewEntity, {
        bookingId: dto.bookingId,
        userId,
        advisorId: booking.advisorId,
        rating: dto.rating,
        comment: dto.comment,
        tags: dto.tags,
      })

      const savedReview = await manager.save(newReview)

      // 更新陪诊师评分
      await this.pzAdvisorService.updateRating(booking.advisorId, dto.rating)
      return savedReview
    })

    return review
  }

  /**
   * 获取陪诊师的所有评价
   */
  async getAdvisorReviews(advisorId: number): Promise<PzReviewEntity[]> {
    return this.pzReviewRepository.find({
      where: { advisorId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })
  }

  /**
   * 获取订单的评价
   */
  async getBookingReview(bookingId: number): Promise<PzReviewEntity | undefined> {
    return this.pzReviewRepository.findOneBy({ bookingId })
  }

  /**
   * 获取评价列表
   */
  async list(dto: PzReviewQueryDto): Promise<Pagination<PzReviewEntity>> {
    const { page, pageSize, advisorId, userId } = dto

    const queryBuilder = this.pzReviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where({
        ...(advisorId ? { advisorId } : null),
        ...(userId ? { userId } : null),
      })
      .orderBy('review.createdAt', 'DESC')

    return paginate<PzReviewEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 获取评价详情
   */
  async info(id: number): Promise<PzReviewEntity> {
    const review = await this.pzReviewRepository.findOneBy({ id })

    if (isEmpty(review))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    return review
  }

  /**
   * 删除评价
   */
  async delete(id: number): Promise<void> {
    const review = await this.info(id)
    await this.pzReviewRepository.delete(id)
  }
}
