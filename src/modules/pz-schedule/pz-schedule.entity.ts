import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

import { PzAdvisorEntity } from '../pz-advisor/pz-advisor.entity'

@Entity({ name: 'pz_schedule' })
export class PzScheduleEntity extends CommonEntity {
  @Column({ type: 'int', name: 'advisor_id', comment: '陪诊师ID' })
  advisorId: number

  @Column({ type: 'date', name: 'schedule_date', comment: '排班日期' })
  scheduleDate: Date

  @Column({ type: 'tinyint', comment: '时段 1上午 2下午 3晚上' })
  period: number

  @Column({ type: 'json', name: 'time_slots', comment: '具体时段，如["09:00","09:30","10:00"]' })
  timeSlots: string[]

  @Column({ type: 'int', default: 3, name: 'max_bookings', comment: '最大可预约数' })
  maxBookings: number

  @Column({ type: 'int', default: 0, name: 'current_bookings', comment: '当前已预约数' })
  currentBookings: number

  @Column({ type: 'tinyint', default: 1, name: 'is_available', comment: '是否可预约' })
  isAvailable: number

  // 关联关系
  @ManyToOne(() => PzAdvisorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'advisor_id' })
  advisor: PzAdvisorEntity
}
