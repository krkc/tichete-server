import {MigrationInterface, QueryRunner} from "typeorm";

export class createUsersTable1600355526644 implements MigrationInterface {
    name = 'createUsersTable1600355526644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `firstName` varchar(255) NULL, `lastName` varchar(255) NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `roleId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
