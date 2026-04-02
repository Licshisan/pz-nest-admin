import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

import { PzAdvisorEntity } from '../pz-advisor/pz-advisor.entity'
import { PzUserEntity } from '../pz-user/pz-user.entity'

// 订单状态枚举
export enum BookingStatus {
  PENDING_PAY = 1, // 待支付
  PENDING_ACCEPT = 2, // 待接单
  SERVICE_IN_PROGRESS = 3, // 服务中
  COMPLETED = 4, // 已完成
  CANCELLED = 5, // 已取消
  REFUNDED = 6, // 已退款
}

// 服务类型枚举
export enum ServiceType {
  FULL_ACCOMPANY = 1, // 全程陪诊
  ERRAND = 2, // 代办跑腿
  GUIDANCE = 3, // 就医指导
}

// 服务时段枚举
export enum ServicePeriod {
  MORNING = 1, // 上午
  AFTERNOON = 2, // 下午
  EVENING = 3, // 晚上
}

@Entity({ name: 'pz_booking' })
export class PzBookingEntity extends CommonEntity {
  @Column({ unique: true, length: 32, comment: '订单编号' })
  orderNo: string

  @Column({ type: 'int', name: 'user_id', comment: '用户ID' })
  userId: number

  @Column({ type: 'int', name: 'advisor_id', nullable: true, comment: '陪诊师ID' })
  advisorId: number

  @Column({ length: 64, name: 'patient_name', comment: '就诊人姓名' })
  patientName: string

  @Column({ type: 'tinyint', name: 'patient_gender', comment: '就诊人性别 1男 2女' })
  patientGender: number

  @Column({ type: 'int', nullable: true, name: 'patient_age', comment: '就诊人年龄' })
  patientAge: number

  @Column({ length: 20, name: 'patient_phone', comment: '就诊人手机号' })
  patientPhone: string

  @Column({ length: 20, nullable: true, name: 'patient_id_card', comment: '就诊人身份证' })
  patientIdCard: string

  @Column({ type: 'tinyint', name: 'service_type', comment: '服务类型 1全程陪诊 2代办跑腿 3就医指导' })
  serviceType: number

  @Column({ type: 'tinyint', name: 'service_period', comment: '服务时段 1上午 2下午 3晚上' })
  servicePeriod: number

  @Column({ type: 'date', name: 'service_date', comment: '服务日期' })
  serviceDate: Date

  @Column({ length: 32, name: 'service_time', comment: '服务时间点' })
  serviceTime: string

  @Column({ length: 255, name: 'service_address', comment: '就诊地址' })
  serviceAddress: string

  @Column({ type: 'text', nullable: true, comment: '陪诊需求描述' })
  requirement: string

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '订单金额' })
  price: number

  @Column({ type: 'tinyint', default: 1, comment: '订单状态 1待支付 2待接单 3服务中 4已完成 5已取消 6已退款' })
  status: number

  @Column({ nullable: true, name: 'pay_time', comment: '支付时间' })
  payTime: Date

  @Column({ nullable: true, length: 20, name: 'pay_method', comment: '支付方式' })
  payMethod: string

  @Column({ type: 'text', nullable: true, comment: '备注' })
  remark: string

  @Column({ nullable: true, length: 255, name: 'cancel_reason', comment: '取消原因' })
  cancelReason: string

  @Column({ nullable: true, name: 'cancel_time', comment: '取消时间' })
  cancelTime: Date

  // 关联关系
  @ManyToOne(() => PzUserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: PzUserEntity

  @ManyToOne(() => PzAdvisorEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'advisor_id' })
  advisor: PzAdvisorEntity
}
