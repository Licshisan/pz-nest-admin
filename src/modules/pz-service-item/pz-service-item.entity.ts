import { Column, Entity } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

/**
 * 陪诊服务项实体
 */
@Entity({ name: 'pz_service_item' })
export class PzServiceItemEntity extends CommonEntity {
  @Column({ length: 255, comment: '服务项名称' })
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '价格(元)' })
  price: number

  @Column({ type: 'varchar', length: 64, comment: '服务类型（如"日间服务""夜间服务""固定服务"）' })
  serviceType: string

  @Column({ type: 'int', nullable: true, comment: '服务时长(小时)' })
  duration: number | null

  @Column({ type: 'int', default: 0, comment: '排序值(越小越靠前)' })
  sort: number

  @Column({ type: 'tinyint', default: 1, comment: '状态 1启用 0禁用' })
  status: number
}
