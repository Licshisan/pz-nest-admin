import { Column, Entity } from 'typeorm'
import { CommonEntity } from '~/common/entity/common.entity'

// 用户性别枚举
export enum UserGender {
  UNKNOWN = 'UNKNOWN', // 未知
  MALE = 'MALE', // 男
  FEMALE = 'FEMALE', // 女
}

// 账号状态枚举
export enum UserStatus {
  DISABLED = 'DISABLED', // 禁用
  ACTIVE = 'ACTIVE', // 正常
}

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

  // 性别
  @Column({ type: 'enum', enum: UserGender, default: UserGender.UNKNOWN })
  gender: UserGender

  // 生日
  @Column({ nullable: true })
  birthday: Date

  // 身份证号
  @Column({ nullable: true })
  idCard: string

  // 账号状态
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus

  // 最后登录时间
  @Column({ nullable: true })
  lastLoginTime: Date
}
