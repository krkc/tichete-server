import {MigrationInterface, QueryRunner} from "typeorm";

export class addUniquenessToRolesUsers1600853598785 implements MigrationInterface {
    name = 'addUniquenessToRolesUsers1600853598785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)");
        await queryRunner.query("ALTER TABLE `role` ADD UNIQUE INDEX `IDX_ae4578dcaed5adff96595e6166` (`name`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `role` DROP INDEX `IDX_ae4578dcaed5adff96595e6166`");
        await queryRunner.query("ALTER TABLE `user` DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`");
    }

}
