import { Column, Entity } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'pz_advisor' })
export class PzAdvisorEntity extends CommonEntity {
  @Column({ length: 64, comment: '陪诊师姓名' })
  name: string

  @Column({ nullable: true, comment: '头像' })
  avatar: string

  @Column({ nullable: true, length: 32, comment: '职称（如：金牌陪诊师）' })
  title: string

  @Column({ type: 'text', nullable: true, comment: '个人简介' })
  intro: string

  @Column({ type: 'json', nullable: true, comment: '标签数组，如["亲和力强","耐心"]' })
  tags: string[]

  @Column({ nullable: true, length: 32, comment: '从业经验，如"5年"' })
  exp: string

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 5.0, comment: '评分 0-5' })
  rate: number

  @Column({ type: 'int', default: 0, comment: '服务次数' })
  serviceCount: number

  @Column({ type: 'json', nullable: true, comment: '擅长科室，如["骨科","眼科"]' })
  specialties: string[]

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 299.0, comment: '半天价格' })
  priceHalf: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 499.0, comment: '全天价格' })
  priceFull: number

  @Column({ type: 'tinyint', default: 1, comment: '状态 1在岗 0休息' })
  status: number

  @Column({ type: 'tinyint', default: 0, comment: '是否认证 0待审核 1已认证' })
  isVerified: number
}
