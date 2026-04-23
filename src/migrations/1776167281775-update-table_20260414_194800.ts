import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTable202604141948001776167281775 implements MigrationInterface {
  name = 'UpdateTable202604141948001776167281775'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` DROP FOREIGN KEY \`FK_d68ea74fcb041c8cfd1fd659844\``)
    await queryRunner.query(`CREATE TABLE \`pz_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`openid\` varchar(255) NOT NULL, \`nickname\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`realName\` varchar(255) NULL, \`gender\` enum ('UNKNOWN', 'MALE', 'FEMALE') NOT NULL DEFAULT 'UNKNOWN', \`birthday\` datetime NULL, \`idCard\` varchar(255) NULL, \`status\` enum ('DISABLED', 'ACTIVE') NOT NULL DEFAULT 'ACTIVE', \`lastLoginTime\` datetime NULL, UNIQUE INDEX \`IDX_1a1d5c19257f9d14b3b2380cc9\` (\`openid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`CREATE TABLE \`pz_advisor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(64) NOT NULL COMMENT '陪诊师姓名', \`avatar\` varchar(255) NULL COMMENT '头像', \`title\` varchar(32) NULL COMMENT '职称（如：金牌陪诊师）', \`intro\` text NULL COMMENT '个人简介', \`tags\` json NULL COMMENT '标签数组，如["亲和力强","耐心"]', \`exp\` varchar(32) NULL COMMENT '从业经验，如"5年"', \`rate\` decimal(3,1) NOT NULL COMMENT '评分 0-5' DEFAULT '5.0', \`serviceCount\` int NOT NULL COMMENT '服务次数' DEFAULT '0', \`specialties\` json NULL COMMENT '擅长科室，如["骨科","眼科"]', \`priceHalf\` decimal(10,2) NOT NULL COMMENT '半天价格' DEFAULT '299.00', \`priceFull\` decimal(10,2) NOT NULL COMMENT '全天价格' DEFAULT '499.00', \`status\` enum ('ON_DUTY', 'OFF_DUTY') NOT NULL COMMENT '状态' DEFAULT 'ON_DUTY', \`isVerified\` enum ('PENDING', 'VERIFIED') NOT NULL COMMENT '认证状态' DEFAULT 'PENDING', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`CREATE TABLE \`pz_review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`booking_id\` int NOT NULL COMMENT '订单ID', \`user_id\` int NOT NULL COMMENT '用户ID', \`advisor_id\` int NULL COMMENT '陪诊师ID', \`rating\` tinyint NOT NULL COMMENT '评分 1-5', \`comment\` text NULL COMMENT '评价内容', \`tags\` json NULL COMMENT '评价标签', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`CREATE TABLE \`pz_booking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`orderNo\` varchar(32) NOT NULL COMMENT '订单编号', \`user_id\` int NOT NULL COMMENT '用户ID', \`advisor_id\` int NULL COMMENT '陪诊师ID', \`patient_name\` varchar(64) NOT NULL COMMENT '就诊人姓名', \`patient_gender\` enum ('MALE', 'FEMALE') NOT NULL COMMENT '就诊人性别', \`patient_age\` int NULL COMMENT '就诊人年龄', \`patient_phone\` varchar(20) NOT NULL COMMENT '就诊人手机号', \`patient_id_card\` varchar(20) NULL COMMENT '就诊人身份证', \`service_type\` enum ('DAY_SERVICE', 'FIXED_SERVICE', 'NIGHT_SERVICE') NOT NULL COMMENT '服务类型（固定服务/日间服务/夜间服务）', \`service_name\` varchar(32) NOT NULL COMMENT '服务名称（一对一/院内服务/跑腿服务）', \`duration\` int NULL COMMENT '服务时长（小时）1/2/4/8', \`service_date\` date NOT NULL COMMENT '服务日期', \`service_time\` varchar(32) NOT NULL COMMENT '服务时间点', \`service_address\` varchar(255) NOT NULL COMMENT '就诊地址', \`requirement\` text NULL COMMENT '陪诊需求描述', \`price\` decimal(10,2) NOT NULL COMMENT '订单金额', \`status\` enum ('PENDING_PAY', 'PENDING_ACCEPT', 'SERVICE_IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL COMMENT '订单状态' DEFAULT 'PENDING_PAY', \`pay_time\` datetime NULL COMMENT '支付时间', \`pay_method\` varchar(20) NULL COMMENT '支付方式', \`remark\` text NULL COMMENT '备注', \`cancel_reason\` varchar(255) NULL COMMENT '取消原因', \`cancel_time\` datetime NULL COMMENT '取消时间', UNIQUE INDEX \`IDX_19e5797fb8c1cba54f29165118\` (\`orderNo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`ALTER TABLE \`sys_dept\` ADD \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dept\` ADD \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` ADD \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` ADD \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` ADD \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` ADD \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` CHANGE \`value\` \`value\` varchar(255) NOT NULL COMMENT '角色标识'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`create_by\` \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`update_by\` \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`create_by\` \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`update_by\` \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`pz_review\` ADD CONSTRAINT \`FK_243b891709c5431ecbc2e420f8f\` FOREIGN KEY (\`user_id\`) REFERENCES \`pz_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`pz_review\` ADD CONSTRAINT \`FK_46f96960feed38612954a157918\` FOREIGN KEY (\`advisor_id\`) REFERENCES \`pz_advisor\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD CONSTRAINT \`FK_c82a05e23bd10fec0bc3c50f943\` FOREIGN KEY (\`user_id\`) REFERENCES \`pz_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` ADD CONSTRAINT \`FK_0a217cfaf528172fdcb168fec64\` FOREIGN KEY (\`advisor_id\`) REFERENCES \`pz_advisor\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP FOREIGN KEY \`FK_0a217cfaf528172fdcb168fec64\``)
    await queryRunner.query(`ALTER TABLE \`pz_booking\` DROP FOREIGN KEY \`FK_c82a05e23bd10fec0bc3c50f943\``)
    await queryRunner.query(`ALTER TABLE \`pz_review\` DROP FOREIGN KEY \`FK_46f96960feed38612954a157918\``)
    await queryRunner.query(`ALTER TABLE \`pz_review\` DROP FOREIGN KEY \`FK_243b891709c5431ecbc2e420f8f\``)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`update_by\` \`update_by\` int NOT NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`create_by\` \`create_by\` int NOT NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`update_by\` \`update_by\` int NOT NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`create_by\` \`create_by\` int NOT NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` CHANGE \`value\` \`value\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` DROP COLUMN \`update_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_role\` DROP COLUMN \`create_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` DROP COLUMN \`update_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` DROP COLUMN \`create_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_dept\` DROP COLUMN \`update_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_dept\` DROP COLUMN \`create_by\``)
    await queryRunner.query(`DROP INDEX \`IDX_19e5797fb8c1cba54f29165118\` ON \`pz_booking\``)
    await queryRunner.query(`DROP TABLE \`pz_booking\``)
    await queryRunner.query(`DROP TABLE \`pz_review\``)
    await queryRunner.query(`DROP TABLE \`pz_advisor\``)
    await queryRunner.query(`DROP INDEX \`IDX_1a1d5c19257f9d14b3b2380cc9\` ON \`pz_user\``)
    await queryRunner.query(`DROP TABLE \`pz_user\``)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` ADD CONSTRAINT \`FK_d68ea74fcb041c8cfd1fd659844\` FOREIGN KEY (\`type_id\`) REFERENCES \`sys_dict_type\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
  }
}
