import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTable202603251639351774427976757 implements MigrationInterface {
  name = 'UpdateTable202603251639351774427976757'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` DROP FOREIGN KEY \`FK_d68ea74fcb041c8cfd1fd659844\``)
    await queryRunner.query(`CREATE TABLE \`pz_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`openid\` varchar(255) NOT NULL, \`unionid\` varchar(255) NULL, \`nickname\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`realName\` varchar(255) NULL, \`gender\` tinyint NOT NULL DEFAULT '0', \`birthday\` datetime NULL, \`idCard\` varchar(255) NULL, \`status\` tinyint NOT NULL DEFAULT '1', \`lastLoginTime\` datetime NULL, UNIQUE INDEX \`IDX_1a1d5c19257f9d14b3b2380cc9\` (\`openid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_1a1d5c19257f9d14b3b2380cc9\` ON \`pz_user\``)
    await queryRunner.query(`DROP TABLE \`pz_user\``)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` ADD CONSTRAINT \`FK_d68ea74fcb041c8cfd1fd659844\` FOREIGN KEY (\`type_id\`) REFERENCES \`sys_dict_type\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
  }
}
