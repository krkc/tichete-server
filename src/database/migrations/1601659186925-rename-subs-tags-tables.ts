import {MigrationInterface, QueryRunner} from "typeorm";

export class renameSubsTagsTables1601659186925 implements MigrationInterface {
    name = 'renameSubsTagsTables1601659186925'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

        await queryRunner.query("CREATE TABLE `subscription` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `categoryId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `tag` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `ticketId` int NOT NULL, `categoryId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `subscription` ADD CONSTRAINT `FK_cc906b4bc892b048f1b654d2aa0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subscription` ADD CONSTRAINT `FK_0ba1800781a037cf117ae3d08d7` FOREIGN KEY (`categoryId`) REFERENCES `ticket_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `tag` ADD CONSTRAINT `FK_59a11fb193e7c5ebb24946f64cb` FOREIGN KEY (`ticketId`) REFERENCES `ticket`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `tag` ADD CONSTRAINT `FK_60fbdce32f9ca3b5afce15a9c32` FOREIGN KEY (`categoryId`) REFERENCES `ticket_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `tag` DROP FOREIGN KEY `FK_60fbdce32f9ca3b5afce15a9c32`");
        await queryRunner.query("ALTER TABLE `tag` DROP FOREIGN KEY `FK_59a11fb193e7c5ebb24946f64cb`");
        await queryRunner.query("ALTER TABLE `subscription` DROP FOREIGN KEY `FK_0ba1800781a037cf117ae3d08d7`");
        await queryRunner.query("ALTER TABLE `subscription` DROP FOREIGN KEY `FK_cc906b4bc892b048f1b654d2aa0`");
        await queryRunner.query("DROP TABLE `tag`");
        await queryRunner.query("DROP TABLE `subscription`");

        await queryRunner.query("CREATE TABLE `subscriptions` (`userId` int NOT NULL, `ticketCategoryId` int NOT NULL, INDEX `IDX_fbdba4e2ac694cf8c9cecf4dc8` (`userId`), INDEX `IDX_d031ddfd7eceb7b46885eacb5d` (`ticketCategoryId`), PRIMARY KEY (`userId`, `ticketCategoryId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `tags` (`ticketId` int NOT NULL, `ticketCategoryId` int NOT NULL, INDEX `IDX_e9cf446118fb13446ef07d6273` (`ticketId`), INDEX `IDX_8c6254dd80cf5972021d82706b` (`ticketCategoryId`), PRIMARY KEY (`ticketId`, `ticketCategoryId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_fbdba4e2ac694cf8c9cecf4dc84` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subscriptions` ADD CONSTRAINT `FK_d031ddfd7eceb7b46885eacb5d0` FOREIGN KEY (`ticketCategoryId`) REFERENCES `ticket_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `tags` ADD CONSTRAINT `FK_e9cf446118fb13446ef07d62738` FOREIGN KEY (`ticketId`) REFERENCES `ticket`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `tags` ADD CONSTRAINT `FK_8c6254dd80cf5972021d82706bd` FOREIGN KEY (`ticketCategoryId`) REFERENCES `ticket_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

}
