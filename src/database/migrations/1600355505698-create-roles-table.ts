import {MigrationInterface, QueryRunner} from "typeorm";

export class createRolesTable1600355505698 implements MigrationInterface {
    name = 'createRolesTable1600355505698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `role`");
    }

}
