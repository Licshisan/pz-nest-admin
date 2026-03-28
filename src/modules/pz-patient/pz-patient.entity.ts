import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

import { PzUserEntity } from '../pz-user/pz-user.entity'

@Entity({ name: 'pz_patient' })
export class PzPatientEntity extends CommonEntity {
  @Column({ type: 'int', name: 'user_id', comment: '用户ID' })
  userId: number

  @Column({ length: 64, comment: '就诊人姓名' })
  name: string

  @Column({ type: 'tinyint', comment: '性别 1男 2女' })
  gender: number

  @Column({ type: 'int', nullable: true, comment: '年龄' })
  age: number

  @Column({ length: 20, comment: '手机号' })
  phone: string

  @Column({ length: 20, nullable: true, name: 'id_card', comment: '身份证号' })
  idCard: string

  @Column({ type: 'tinyint', default: 0, name: 'is_default', comment: '是否默认就诊人' })
  isDefault: number

  // 关联关系
  @ManyToOne(() => PzUserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: PzUserEntity
}
