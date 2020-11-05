import {MigrationInterface, QueryRunner} from "typeorm";

export class addUsername1604332726580 implements MigrationInterface {
    name = 'addUsername1604332726580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `username` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `username`");
    }

}
