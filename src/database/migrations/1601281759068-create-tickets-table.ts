import {MigrationInterface, QueryRunner} from "typeorm";

export class createTicketsTable1601281759068 implements MigrationInterface {
    name = 'createTicketsTable1601281759068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `ticket` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NULL, `description` varchar(255) NULL, `creatorId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `ticket` ADD CONSTRAINT `FK_8f39aebfe95a905bafb494fd74b` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `ticket` DROP FOREIGN KEY `FK_8f39aebfe95a905bafb494fd74b`");
        await queryRunner.query("DROP TABLE `ticket`");
    }

}
