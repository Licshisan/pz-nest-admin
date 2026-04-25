import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPzServiceItem1780000000000 implements MigrationInterface {
  name = 'AddPzServiceItem1780000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create pz_service_item table
    await queryRunner.query(`
      CREATE TABLE \`pz_service_item\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`name\` varchar(255) NOT NULL COMMENT '服务项名称',
        \`price\` decimal(10,2) NOT NULL COMMENT '价格(元)',
        \`service_type\` varchar(64) NOT NULL COMMENT '服务类型（如"日间服务""夜间服务""固定服务"）',
        \`duration\` int NULL COMMENT '服务时长(小时)',
        \`sort\` int NOT NULL DEFAULT 0 COMMENT '排序值(越小越靠前)',
        \`status\` tinyint NOT NULL DEFAULT 1 COMMENT '状态 1启用 0禁用',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    // Insert initial data
    await queryRunner.query(`
      INSERT INTO \`pz_service_item\` (\`name\`, \`price\`, \`service_type\`, \`duration\`, \`sort\`) VALUES
      ('【一对一】2小时陪诊', 178.00, '日间服务', 2, 1),
      ('【一对一】4小时陪诊', 288.00, '日间服务', 4, 2),
      ('【一对一】8小时陪诊', 520.00, '日间服务', 8, 3),
      ('【加时1小时】单拍无效', 70.00, '日间服务', 1, 4),
      ('【院内服务】取报告/取号', 88.00, '固定服务', NULL, 1),
      ('【跑腿服务】代取药/代约检查', 88.00, '固定服务', NULL, 2),
      ('北京各大医院绿色通道挂号/住院咨询', 500.00, '固定服务', NULL, 3),
      ('【一对一夜间】2小时陪诊', 356.00, '夜间服务', 2, 1),
      ('【一对一夜间】4小时陪诊', 576.00, '夜间服务', 4, 2),
      ('【一对一夜间】单拍无效', 70.00, '夜间服务', 1, 3)
    `)

    // Modify pz_booking table - change service_type column type
    await queryRunner.query(`
      ALTER TABLE \`pz_booking\`
      MODIFY COLUMN \`service_type\` varchar(64) NOT NULL COMMENT '服务类型（冗余字段，记录下单时的值）'
    `)

    // Add service_item_id column
    await queryRunner.query(`
      ALTER TABLE \`pz_booking\`
      ADD COLUMN \`service_item_id\` int NULL COMMENT '服务项ID'
      AFTER \`advisor_id\`
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop service_item_id column
    await queryRunner.query(`
      ALTER TABLE \`pz_booking\`
      DROP COLUMN \`service_item_id\`
    `)

    // Revert service_type column to enum
    await queryRunner.query(`
      ALTER TABLE \`pz_booking\`
      MODIFY COLUMN \`service_type\` enum('DAY_SERVICE','FIXED_SERVICE','NIGHT_SERVICE') NOT NULL COMMENT '服务类型（固定服务/日间服务/夜间服务）'
    `)

    // Drop pz_service_item table
    await queryRunner.query(`DROP TABLE \`pz_service_item\``)
  }
}
