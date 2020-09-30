import {MigrationInterface, QueryRunner} from "typeorm";

export class createTicketStatusesTable1601409546037 implements MigrationInterface {
    name = 'createTicketStatusesTable1601409546037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `ticket_status` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `ticket` ADD `statusId` int NULL");
        await queryRunner.query("ALTER TABLE `ticket` ADD CONSTRAINT `FK_7312ac8aab89dd3586729d97ea0` FOREIGN KEY (`statusId`) REFERENCES `ticket_status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `ticket` DROP FOREIGN KEY `FK_7312ac8aab89dd3586729d97ea0`");
        await queryRunner.query("ALTER TABLE `ticket` DROP COLUMN `statusId`");
        await queryRunner.query("DROP TABLE `ticket_status`");
    }

}
