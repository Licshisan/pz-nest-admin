import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty, isNil } from 'lodash'
import { EntityManager, Like, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ISecurityConfig, IWechatConfig, SecurityConfig, WechatConfig } from '~/config'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { PzUserDto, PzUserQueryDto, PzUserUpdateDto } from './dto/pz-user.dto'
import { PzUserEntity, UserStatus } from './pz-user.entity'

@Injectable()
export class PzUserService {
  constructor(
    @InjectRepository(PzUserEntity)
    private readonly pzUserRepository: Repository<PzUserEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
    private http: HttpService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    @Inject(WechatConfig.KEY) private wechatConfig: IWechatConfig,
  ) {}

  /**
   * 微信登录 - 创建或更新用户
   * 返回用户信息和是否新用户
   */
  async wechatLogin(dto: { code: string }, userInfo?: { nickname?: string, avatar?: string }): Promise<PzUserEntity> {
    // 通过 code 获取 openid
    const { openid } = await this.code2Session(dto.code)

    let user = await this.findUserByOpenid(openid)

    if (isEmpty(user)) {
      // 新用户，创建用户
      user = await this.entityManager.transaction(async (manager) => {
        const newUser = manager.create(PzUserEntity, {
          openid,
          nickname: userInfo?.nickname,
          avatar: userInfo?.avatar,
          status: UserStatus.ACTIVE,
        })

        return manager.save(newUser)
      })

      return user
    }

    // 老用户，更新用户信息
    if (userInfo) {
      await this.pzUserRepository.update(user.id, {
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        lastLoginTime: new Date(),
      })
      user = await this.info(user.id)
    }

    return user
  }

  /**
   * 根据OpenID查找微信用户
   */
  async findUserByOpenid(openid: string): Promise<PzUserEntity | undefined> {
    return this.pzUserRepository
      .createQueryBuilder('user')
      .where({
        openid,
        status: UserStatus.ACTIVE,
      })
      .getOne()
  }

  /**
   * 根据ID查找用户
   */
  async findUserById(id: number): Promise<PzUserEntity | undefined> {
    return this.pzUserRepository.findOneBy({ id })
  }

  /**
   * 获取微信用户信息
   */
  async info(id: number): Promise<PzUserEntity> {
    const user = await this.pzUserRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne()

    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    return user
  }

  /**
   * 创建微信用户
   */
  async create(dto: PzUserDto): Promise<void> {
    const exists = await this.pzUserRepository.findOneBy({
      openid: dto.openid,
    })

    if (!isEmpty(exists))
      throw new BusinessException('该微信用户已存在')

    await this.entityManager.transaction(async (manager) => {
      const u = manager.create(PzUserEntity, {
        ...dto,
      })

      await manager.save(u)
    })
  }

  /**
   * 更新微信用户
   */
  async update(
    id: number,
    dto: PzUserUpdateDto,
  ): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(PzUserEntity, id, {
        ...dto,
      })
    })
  }

  /**
   * 删除微信用户
   */
  async delete(ids: number[]): Promise<void> {
    await this.pzUserRepository.delete(ids)
  }

  /**
   * 查询微信用户列表
   */
  async list({
    page,
    pageSize,
    nickname,
    phone,
    status,
  }: PzUserQueryDto): Promise<Pagination<PzUserEntity>> {
    const queryBuilder = this.pzUserRepository
      .createQueryBuilder('user')
      .where({
        ...(nickname ? { nickname: Like(`%${nickname}%`) } : null),
        ...(phone ? { phone: Like(`%${phone}%`) } : null),
        ...(!isNil(status) ? { status } : null),
      })

    return paginate<PzUserEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 微信小程序登录 - 获取用户 openid
   */
  async code2Session(code: string): Promise<{ openid: string, sessionKey: string }> {
    const { miniAppId, miniAppSecret } = this.wechatConfig

    const url = 'https://api.weixin.qq.com/sns/jscode2session'
    const params = {
      appid: miniAppId,
      secret: miniAppSecret,
      js_code: code,
      grant_type: 'authorization_code',
    }

    try {
      const { data } = await this.http.axiosRef.get(url, { params })

      if (data.errcode) {
        throw new BusinessException(`微信接口错误: ${data.errmsg || data.errcode}`)
      }

      if (!data.openid) {
        throw new BusinessException('微信登录失败，未获取到 openid')
      }

      return {
        openid: data.openid,
        sessionKey: data.session_key,
      }
    }
    catch (error: any) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new BusinessException(`微信登录请求失败: ${error.message}`)
    }
  }
}
