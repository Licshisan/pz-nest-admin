import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

import { PzAdvisorEntity } from '../pz-advisor/pz-advisor.entity'
import { PzUserEntity } from '../pz-user/pz-user.entity'

@Entity({ name: 'pz_review' })
export class PzReviewEntity extends CommonEntity {
  @Column({ type: 'int', name: 'booking_id', comment: '订单ID' })
  bookingId: number

  @Column({ type: 'int', name: 'user_id', comment: '用户ID' })
  userId: number

  @Column({ type: 'int', name: 'advisor_id', comment: '陪诊师ID' })
  advisorId: number

  @Column({ type: 'tinyint', comment: '评分 1-5' })
  rating: number

  @Column({ type: 'text', nullable: true, comment: '评价内容' })
  comment: string

  @Column({ type: 'json', nullable: true, comment: '评价标签' })
  tags: string[]

  // 关联关系
  @ManyToOne(() => PzUserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: PzUserEntity

  @ManyToOne(() => PzAdvisorEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'advisor_id' })
  advisor: PzAdvisorEntity
}
