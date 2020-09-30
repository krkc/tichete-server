import {MigrationInterface, QueryRunner} from "typeorm";

export class createTicketCategoriesTable1601472809315 implements MigrationInterface {
    name = 'createTicketCategoriesTable1601472809315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `ticket_category` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `subscriptions` (`userId` int NOT NULL, `ticketCategoryId` int NOT NULL, INDEX `IDX_fbdba4e2ac694cf8c9cecf4dc8` (`userId`), INDEX `IDX_d031ddfd7eceb7b46885eacb5d` (`ticketCategoryId`), PRIMARY KEY (`userId`, `ticketCategoryId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `tags` (`ticketId` int NOT NULL, `ticketCategoryId` int NOT NULL, INDEX `IDX_e9cf446118fb13446ef07d6273` (`ticketId`), INDEX `IDX_8c6254dd80cf5972021d82706b` (`ticketCategoryId`), PRIMARY KEY (`ticketId`, `ticketCategoryId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_fbdba4e2ac694cf8c9cecf4dc84` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_d031ddfd7eceb7b46885eacb5d0` FOREIGN KEY (`ticketCategoryId`) REFERENCES `ticket_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `tags` ADD CONSTRAINT `FK_e9cf446118fb13446ef07d62738` FOREIGN KEY (`ticketId`) REFERENCES `ticket`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `tags` ADD CONSTRAINT `FK_8c6254dd80cf5972021d82706bd` FOREIGN KEY (`ticketCategoryId`) REFERENCES `ticket_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `tags` DROP FOREIGN KEY `FK_8c6254dd80cf5972021d82706bd`");
        await queryRunner.query("ALTER TABLE `tags` DROP FOREIGN KEY `FK_e9cf446118fb13446ef07d62738`");
        await queryRunner.query("ALTER TABLE `subscriptions` DROP FOREIGN KEY `FK_d031ddfd7eceb7b46885eacb5d0`");
        await queryRunner.query("ALTER TABLE `subscriptions` DROP FOREIGN KEY `FK_fbdba4e2ac694cf8c9cecf4dc84`");
        await queryRunner.query("DROP INDEX `IDX_8c6254dd80cf5972021d82706b` ON `tags`");
        await queryRunner.query("DROP INDEX `IDX_e9cf446118fb13446ef07d6273` ON `tags`");
        await queryRunner.query("DROP TABLE `tags`");
        await queryRunner.query("DROP INDEX `IDX_d031ddfd7eceb7b46885eacb5d` ON `subscriptions`");
        await queryRunner.query("DROP INDEX `IDX_fbdba4e2ac694cf8c9cecf4dc8` ON `subscriptions`");
        await queryRunner.query("DROP TABLE `subscriptions`");
        await queryRunner.query("DROP TABLE `ticket_category`");
    }

}
