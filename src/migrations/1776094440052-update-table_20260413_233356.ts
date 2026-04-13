import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTable202604132333561776094440052 implements MigrationInterface {
  name = 'UpdateTable202604132333561776094440052'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`pz_user\` DROP COLUMN \`gender\``)
    await queryRunner.query(`ALTER TABLE \`pz_user\` ADD \`gender\` enum ('UNKNOWN', 'MALE', 'FEMALE') NOT NULL DEFAULT 'UNKNOWN'`)
    await queryRunner.query(`ALTER TABLE \`pz_user\` DROP COLUMN \`status\``)
    await queryRunner.query(`ALTER TABLE \`pz_user\` ADD \`status\` enum ('DISABLED', 'ACTIVE') NOT NULL DEFAULT 'ACTIVE'`)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` DROP COLUMN \`status\``)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` ADD \`status\` enum ('ON_DUTY', 'OFF_DUTY') NOT NULL COMMENT '状态' DEFAULT 'ON_DUTY'`)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` DROP COLUMN \`isVerified\``)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` ADD \`isVerified\` enum ('PENDING', 'VERIFIED') NOT NULL COMMENT '认证状态' DEFAULT 'PENDING'`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`patient_gender\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`patient_gender\` enum ('MALE', 'FEMALE') NOT NULL COMMENT '就诊人性别'`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`service_type\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`service_type\` enum ('FULL_ACCOMPANY', 'ERRAND', 'GUIDANCE') NOT NULL COMMENT '服务类型'`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`service_period\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`service_period\` enum ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT_AM', 'NIGHT_PM') NOT NULL COMMENT '服务时段'`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`status\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`status\` enum ('PENDING_PAY', 'PENDING_ACCEPT', 'SERVICE_IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL COMMENT '订单状态' DEFAULT 'PENDING_PAY'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`status\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`status\` tinyint NOT NULL COMMENT '订单状态 1待支付 2待接单 3服务中 4已完成 5已取消 6已退款' DEFAULT '1'`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`service_period\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`service_period\` tinyint NOT NULL COMMENT '服务时段 1上午 2下午 3晚上 4夜间上午 5夜间下午'`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`service_type\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`service_type\` tinyint NOT NULL COMMENT '服务类型 1全程陪诊 2代办跑腿 3就医指导'`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP COLUMN \`patient_gender\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD \`patient_gender\` tinyint NOT NULL COMMENT '就诊人性别 1男 2女'`)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` DROP COLUMN \`isVerified\``)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` ADD \`isVerified\` tinyint NOT NULL COMMENT '是否认证 0待审核 1已认证' DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` DROP COLUMN \`status\``)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` ADD \`status\` tinyint NOT NULL COMMENT '状态 1在岗 0休息' DEFAULT '1'`)
    await queryRunner.query(`ALTER TABLE \`pz_user\` DROP COLUMN \`status\``)
    await queryRunner.query(`ALTER TABLE \`pz_user\` ADD \`status\` tinyint NOT NULL DEFAULT '1'`)
    await queryRunner.query(`ALTER TABLE \`pz_user\` DROP COLUMN \`gender\``)
    await queryRunner.query(`ALTER TABLE \`pz_user\` ADD \`gender\` tinyint NOT NULL DEFAULT '0'`)
  }
}
