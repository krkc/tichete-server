import {MigrationInterface, QueryRunner} from "typeorm";

export class createPermissionsTable1609232417396 implements MigrationInterface {
    name = 'createPermissionsTable1609232417396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `permission` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `resourceName` varchar(255) NOT NULL, `creatorOnly` tinyint NOT NULL DEFAULT 0, `canCreate` tinyint NOT NULL DEFAULT 0, `canRead` tinyint NOT NULL DEFAULT 0, `canUpdate` tinyint NOT NULL DEFAULT 0, `canDelete` tinyint NOT NULL DEFAULT 0, `roleId` int NOT NULL, UNIQUE INDEX `IDX_40026181e09f1de6758816d09b` (`resourceName`, `creatorOnly`, `roleId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `role` ADD `isSystemAdmin` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `permission` ADD CONSTRAINT `FK_cdb4db95384a1cf7a837c4c683e` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `permission` DROP FOREIGN KEY `FK_cdb4db95384a1cf7a837c4c683e`");
        await queryRunner.query("ALTER TABLE `role` DROP COLUMN `isSystemAdmin`");
        await queryRunner.query("DROP INDEX `IDX_40026181e09f1de6758816d09b` ON `permission`");
        await queryRunner.query("DROP TABLE `permission`");
    }

}
