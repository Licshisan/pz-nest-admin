import { Column, Entity } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

// 陪诊师状态枚举
export enum AdvisorStatus {
  ON_DUTY = 'ON_DUTY', // 在岗
  OFF_DUTY = 'OFF_DUTY', // 休息
}

@Entity({ name: 'pz_advisor' })
export class PzAdvisorEntity extends CommonEntity {
  @Column({ nullable: true, comment: '头像' })
  avatar: string

  @Column({ length: 64, comment: '陪诊师姓名' })
  name: string

  @Column({ nullable: true, length: 32, comment: '职称（如：金牌陪诊师）' })
  title: string

  @Column({ type: 'json', nullable: true, comment: '标签数组，如["亲和力强","耐心"]' })
  tags: string[]

  @Column({ type: 'longtext', nullable: true, comment: '个人介绍（支持富文本）' })
  intro: string

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 5.0, comment: '评分 0-5' })
  rate: number

  @Column({ type: 'int', default: 0, comment: '服务次数' })
  serviceCount: number

  @Column({ type: 'enum', enum: AdvisorStatus, default: AdvisorStatus.ON_DUTY, comment: '状态' })
  status: AdvisorStatus
}
