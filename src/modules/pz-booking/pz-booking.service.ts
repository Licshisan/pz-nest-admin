import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty, isNil } from 'lodash'
import { EntityManager, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { PzAdvisorService } from '../pz-advisor/pz-advisor.service'
import { PzServiceItemEntity } from '../pz-service-item/pz-service-item.entity'
import { PzBookingCreateDto, PzBookingQueryDto, PzBookingSubmitDto, PzBookingUpdateStatusDto } from './dto/pz-booking.dto'
import { BookingStatus, PzBookingEntity } from './pz-booking.entity'

@Injectable()
export class PzBookingService {
  constructor(
    @InjectRepository(PzBookingEntity)
    private readonly pzBookingRepository: Repository<PzBookingEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
    private pzAdvisorService: PzAdvisorService,
  ) {}

  /**
   * 获取用户的订单列表
   */
  async getUserBookings(userId: number, status?: BookingStatus): Promise<PzBookingEntity[]> {
    return this.pzBookingRepository.find({
      where: {
        userId,
        ...(!isNil(status) ? { status } : null),
      },
      relations: ['advisor'],
      order: { createdAt: 'DESC' },
    })
  }

  /**
   * 根据订单号查询订单详情
   */
  async findByOrderNo(orderNo: string, uid?: number): Promise<PzBookingEntity> {
    const booking = await this.pzBookingRepository.findOne({
      where: { orderNo },
      relations: ['user', 'advisor'],
    })

    if (isEmpty(booking))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    if (uid && booking.userId !== uid)
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    return booking
  }

  /**
   * 小程序提交陪诊订单
   */
  async submit(uid: number, dto: PzBookingSubmitDto) {
    // 获取服务项价格
    const price = await this.getPzServiceItemPrice(dto.serviceItemId)

    const booking = await this.entityManager.transaction(async (manager) => {
      const newBooking = manager.create(PzBookingEntity, {
        orderNo: this.generateOrderNo(),
        userId: uid,
        serviceItemId: dto.serviceItemId,
        advisorId: dto.advisorId,
        patientName: dto.patientName,
        patientGender: dto.patientGender,
        patientAge: dto.patientAge,
        patientPhone: dto.patientPhone,
        patientIdCard: dto.patientIdCard,
        serviceDate: new Date(dto.serviceDate),
        serviceTime: dto.serviceTime,
        serviceAddress: dto.serviceAddress,
        requirement: dto.requirement,
        price,
        status: BookingStatus.PENDING_PAY,
      })

      return manager.save(newBooking)
    })

    return booking
  }

  /**
   * 取消订单
   */
  async cancel(id: number, dto: PzBookingUpdateStatusDto, userId: number): Promise<void> {
    const booking = await this.info(id)

    // 验证是否是订单所有者
    if (booking.userId !== userId) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    // 只有待支付和待接单状态可以取消
    if (booking.status !== BookingStatus.PENDING_PAY && booking.status !== BookingStatus.PENDING_ACCEPT) {
      throw new BusinessException('该订单状态不允许取消')
    }

    await this.pzBookingRepository.update(id, {
      status: BookingStatus.CANCELLED,
      cancelReason: dto.cancelReason,
      cancelTime: new Date(),
    })
  }

  /**
   * 生成订单编号
   */
  private generateOrderNo(): string {
    const timestamp = Date.now().toString()
    const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `PZ${timestamp}${randomStr}`
  }

  /**
   * 获取订单详情
   */
  async info(id: number): Promise<PzBookingEntity> {
    const booking = await this.pzBookingRepository.findOne({
      where: { id },
      relations: ['user', 'advisor'],
    })

    if (isEmpty(booking))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    return booking
  }

  /**
   * 获取订单列表
   */
  async list(dto: PzBookingQueryDto): Promise<Pagination<PzBookingEntity>> {
    const { page, pageSize, userId, advisorId, status, serviceDateFrom, serviceDateTo } = dto

    const queryBuilder = this.pzBookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.advisor', 'advisor')
      .where({
        ...(userId ? { userId } : null),
        ...(advisorId ? { advisorId } : null),
        ...(!isNil(status) ? { status } : null),
        ...(serviceDateFrom ? { serviceDate: MoreThanOrEqual(new Date(serviceDateFrom)) } : null),
        ...(serviceDateTo ? { serviceDate: LessThanOrEqual(new Date(serviceDateTo)) } : null),
      })
      .orderBy('booking.createdAt', 'DESC')

    return paginate<PzBookingEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 创建订单
   */
  async create(userId: number, dto: PzBookingCreateDto): Promise<PzBookingEntity> {
    // 获取服务项价格
    const price = await this.getPzServiceItemPrice(dto.serviceItemId)

    const booking = await this.entityManager.transaction(async (manager) => {
      const newBooking = manager.create(PzBookingEntity, {
        orderNo: this.generateOrderNo(),
        userId,
        serviceItemId: dto.serviceItemId,
        serviceType: dto.serviceType || '',
        serviceName: dto.serviceName || '',
        duration: dto.duration,
        ...dto,
        serviceDate: new Date(dto.serviceDate),
        price,
        status: BookingStatus.PENDING_PAY,
      })

      return manager.save(newBooking)
    })

    return booking
  }

  /**
   * 更新订单状态
   */
  async updateStatus(id: number, dto: PzBookingUpdateStatusDto): Promise<void> {
    const booking = await this.info(id)

    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BusinessException('该订单状态不允许修改')
    }

    await this.entityManager.transaction(async (manager) => {
      const updateData: Partial<PzBookingEntity> = {
        status: dto.status,
      }

      // 如果是取消，更新取消原因和时间
      if (dto.status === BookingStatus.CANCELLED) {
        updateData.cancelReason = dto.cancelReason
        updateData.cancelTime = new Date()
      }

      // 如果是完成，增加陪诊师服务次数
      if (dto.status === BookingStatus.COMPLETED) {
        await this.pzAdvisorService.incrementServiceCount(booking.advisorId)
      }

      await manager.update(PzBookingEntity, id, updateData)
    })
  }

  /**
   * 模拟支付（实际项目中需要接入微信支付）
   */
  async pay(id: number, userId: number): Promise<void> {
    const booking = await this.info(id)

    if (booking.userId !== userId) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    if (booking.status !== BookingStatus.PENDING_PAY) {
      throw new BusinessException('该订单不是待支付状态')
    }

    await this.pzBookingRepository.update(id, {
      status: BookingStatus.PENDING_ACCEPT,
      payTime: new Date(),
      payMethod: 'wechat',
    })
  }

  /**
   * 删除订单（仅物理删除已取消的订单）
   */
  async delete(ids: number[]): Promise<void> {
    await this.pzBookingRepository.delete(ids)
  }

  /**
   * 获取服务项价格
   */
  private async getPzServiceItemPrice(serviceItemId: number): Promise<number> {
    const serviceItem = await this.entityManager.findOne(PzServiceItemEntity, {
      where: { id: serviceItemId, status: 1 },
      select: ['price'],
    })

    if (!serviceItem) {
      throw new BusinessException('服务项不存在或已下架')
    }

    return serviceItem.price
  }
}
