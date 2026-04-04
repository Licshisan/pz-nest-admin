import { Column, Entity } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'pz_user' })
export class PzUserEntity extends CommonEntity {
  // 微信小程序唯一标识（核心登录字段）
  @Column({ unique: true })
  openid: string

  // 微信昵称
  @Column({ nullable: true })
  nickname: string

  // 微信头像
  @Column({ nullable: true })
  avatar: string

  // 手机号（用于预约联系）
  @Column({ nullable: true })
  phone: string

  // 真实姓名
  @Column({ nullable: true })
  realName: string

  // 性别 0未知 1男 2女
  @Column({ type: 'tinyint', default: 0 })
  gender: number

  // 生日
  @Column({ nullable: true })
  birthday: Date

  // 身份证号
  @Column({ nullable: true })
  idCard: string

  // 账号状态 1正常 0禁用
  @Column({ type: 'tinyint', default: 1 })
  status: number

  // 最后登录时间
  @Column({ nullable: true })
  lastLoginTime: Date
}
