import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTable202604252134181777124059254 implements MigrationInterface {
  name = 'UpdateTable202604252134181777124059254'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` DROP COLUMN \`exp\``)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` DROP COLUMN \`isVerified\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` CHANGE \`service_address\` \`service_address\` varchar(255) NOT NULL COMMENT '服务地址'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`pz_booking\` CHANGE \`service_address\` \`service_address\` varchar(255) NOT NULL COMMENT '就诊地址'`)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` ADD \`isVerified\` enum ('PENDING', 'VERIFIED') NOT NULL COMMENT '认证状态' DEFAULT 'PENDING'`)
    await queryRunner.query(`ALTER TABLE \`pz_advisor\` ADD \`exp\` varchar(32) NULL COMMENT '从业经验，如"5年"'`)
  }
}
