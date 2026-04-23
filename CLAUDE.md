# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 项目概述

这是一个基于 NestJS 的医疗陪诊管理系统（陪诊管理系统），采用全栈架构，包括后端 API 和独立的 Vue3 前端。系统提供管理用户、陪诊师、预约、评价等医疗陪诊服务的完整功能。

## 核心技术

- **后端**: NestJS 11.x, TypeScript, Fastify, TypeORM, Redis
- **数据库**: MySQL 8.x (UTF8MB4 字符集)
- **认证**: JWT + Passport (Local, JWT 策略)
- **存储**: Redis 缓存，OSS (七牛云) 文件存储
- **测试**: Jest
- **包管理器**: pnpm (必需，版本 >= 9)

## 开发命令

### 基础开发命令
```bash
# 安装依赖 (必需)
pnpm install

# 开发模式 (带热重载)
pnpm dev

# 生产环境构建
pnpm build

# 生产环境启动
pnpm start:prod

# 运行测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 代码检查
pnpm lint

# 自动修复代码格式
pnpm lint:fix
```

### 数据库操作
```bash
# 创建迁移 (注意 Windows 特定命令)
pnpm migration:create ./src/migrations/initData
# Windows 使用特定版本
pnpm migration:generate_win
pnpm migration:generate

# 运行迁移
pnpm migration:run

# 回滚最后一次迁移
pnpm migration:revert

# 注意: 如果实体有变更，迁移前必须先运行 pnpm build
```

### Docker 命令
```bash
# 快速启动 (使用预构建容器，用于演示/测试)
pnpm docker:up

# 停止容器
pnpm docker:down

# 删除容器和镜像
pnpm docker:rmi

# 查看日志
pnpm docker:logs

# 构建并启动容器
pnpm docker:build:dev
```

## 架构概述

### 核心模块
- **Auth 模块**: 处理认证、授权 (RBAC)、JWT 令牌和权限
- **System 模块**: 管理系统配置、字典、部门、用户
- **Pz 模块**: 医疗陪诊业务逻辑：
  - PzUser: 用户管理
  - PzAdvisor: 陪诊师管理
  - PzBooking: 预约管理
  - PzReview: 评价系统
- **Netdisk 模块**: 文件存储管理
- **SSE 模块**: 服务器发送事件，实现实时更新

### 通用模式
- **BaseService**: 通用 CRUD 服务，支持分页
- **DTOs**: 一致的数据传输对象，带验证
- **装饰器**: 通用功能装饰器 (@AllowAnon, @AuthUser, @Permission)
- **拦截器**: 全局拦截器用于日志、转换、超时、幂等性
- **守卫**: JWT 认证、RBAC、基于资源的访问控制

### 认证与授权
- JWT 令牌 + 刷新令牌机制
- 基于角色的访问控制 (RBAC)
- 资源级权限控制
- 支持多设备登录
- API 端点自定义守卫

### 数据库与 ORM
- TypeORM，实体位于 `src/modules/*/entities/`
- 自定义约束：EntityExist、Unique
- 带游标支持的分页助手
- 从模块自动加载实体

### 配置管理
- 环境特定配置：`.env`、`.env.development`、`.env.production`
- 使用 `@nestjs/config` 的配置模块，带验证
- 通过 `ConfigKeyPaths` 实现类型安全的配置访问

### 测试
- Jest 配置支持 TypeScript
- 测试文件与源文件同级，使用 `.spec.ts` 后缀
- 启用覆盖率收集

## 代码规范

### 文件结构
- Controllers: 处理 HTTP 请求和路由
- Services: 包含业务逻辑
- Entities: 定义数据库模型
- DTOs: 定义请求/响应模式
- 通用工具在 `src/common/` 和 `src/helper/`

### 开发注意事项
- 运行迁移前必须先构建 (`pnpm build`)
- 使用 `pnpm docker:up` 快速启动 Docker 服务进行开发
- 运行时可在 `/api-docs` 访问 API 文档
- 默认管理员账号：`admin/a123456`
- 所有新用户默认密码：`a123456`

## 重要文件
- `src/main.ts`: 应用引导，配置 Fastify、CORS、Swagger
- `src/app.module.ts`: 根模块，包含所有功能模块
- `deploy/sql/nest_admin.sql`: 数据库架构初始化
- `docker-compose.yml`: 开发环境（包含 MySQL 和 Redis）
- `.env` 文件：不同环境的配置

## 业务模块说明

### Pz 系列模块
这是医疗陪诊系统的核心业务模块：
- **PzUser**: 管理平台用户（管理员、普通用户等）
- **PzAdvisor**: 管理陪诊师信息、资质、状态
- **PzBooking**: 处理预约流程、状态管理、时间冲突检测
- **PzReview**: 用户评价系统，包含评分和反馈

### 权限系统
采用角色-权限-资源三级权限模型：
- 角色：超级管理员、普通管理员等
- 权限：增删改查等操作权限
- 资源：具体的业务模块或数据

### 缓存策略
- Redis 用于会话缓存、API 缓存
- 使用缓存装饰器简化缓存操作
- 支持缓存键自动生成和过期管理
