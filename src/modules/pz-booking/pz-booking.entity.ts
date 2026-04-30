import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

import { PzAdvisorEntity } from '../pz-advisor/pz-advisor.entity'
import { PzReviewEntity } from '../pz-review/pz-review.entity'
import { PzServiceItemEntity } from '../pz-service-item/pz-service-item.entity'
import { PzUserEntity } from '../pz-user/pz-user.entity'

// 就诊人性别枚举
export enum PatientGender {
  MALE = 'MALE', // 男
  FEMALE = 'FEMALE', // 女
}

// 订单状态枚举
export enum BookingStatus {
  PENDING_ACCEPT = 'PENDING_ACCEPT', // 待确定
  SERVICE_IN_PROGRESS = 'SERVICE_IN_PROGRESS', // 服务中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
}

// 支付状态枚举
export enum PayStatus {
  UNPAID = 'UNPAID', // 待支付
  PAID = 'PAID', // 已支付
  REFUNDED = 'REFUNDED', // 已退款
}

@Entity({ name: 'pz_booking' })
export class PzBookingEntity extends CommonEntity {
  @Column({ unique: true, length: 32, comment: '订单编号' })
  orderNo: string

  @Column({ type: 'int', name: 'user_id', comment: '用户ID' })
  userId: number

  @Column({ type: 'int', name: 'advisor_id', nullable: true, comment: '陪诊师ID' })
  advisorId: number

  @Column({ type: 'int', name: 'service_item_id', nullable: true, comment: '服务项ID' })
  serviceItemId: number | null

  @Column({ length: 64, nullable: true, name: 'service_type', comment: '下单时服务类型快照' })
  serviceType: string

  @Column({ length: 64, nullable: true, name: 'service_name', comment: '下单时服务名称快照' })
  serviceName: string

  @Column({ type: 'int', nullable: true, comment: '下单时服务时长快照' })
  duration: number | null

  @Column({ length: 64, name: 'patient_name', comment: '就诊人姓名' })
  patientName: string

  @Column({ type: 'enum', enum: PatientGender, name: 'patient_gender', comment: '就诊人性别' })
  patientGender: PatientGender

  @Column({ type: 'int', nullable: true, name: 'patient_age', comment: '就诊人年龄' })
  patientAge: number

  @Column({ length: 20, name: 'patient_phone', comment: '就诊人手机号' })
  patientPhone: string

  @Column({ length: 20, nullable: true, name: 'patient_id_card', comment: '就诊人身份证' })
  patientIdCard: string

  @Column({ type: 'date', name: 'service_date', comment: '服务日期' })
  serviceDate: Date

  @Column({ length: 32, name: 'service_time', comment: '服务时间点' })
  serviceTime: string

  @Column({ length: 255, name: 'service_address', comment: '服务地址' })
  serviceAddress: string

  @Column({ type: 'text', nullable: true, comment: '陪诊需求描述' })
  requirement: string

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '订单金额' })
  price: number

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING_ACCEPT, comment: '履约状态' })
  status: BookingStatus

  @Column({ type: 'enum', enum: PayStatus, default: PayStatus.UNPAID, name: 'pay_status', comment: '支付状态' })
  payStatus: PayStatus

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

  @ManyToOne(() => PzServiceItemEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'service_item_id' })
  serviceItem: PzServiceItemEntity | null

  @OneToOne(() => PzReviewEntity, review => review.booking)
  review: PzReviewEntity | null

  hasReview?: boolean
}
