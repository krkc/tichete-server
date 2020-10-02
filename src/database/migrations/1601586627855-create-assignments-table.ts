import {MigrationInterface, QueryRunner} from "typeorm";

export class createAssignmentsTable1601586627855 implements MigrationInterface {
    name = 'createAssignmentsTable1601586627855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `assignment` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `ticketId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `assignment` ADD CONSTRAINT `FK_b3ae3ab674b9ba61a5771e906da` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `assignment` ADD CONSTRAINT `FK_120fccbd6a68efddd56d49559f4` FOREIGN KEY (`ticketId`) REFERENCES `ticket`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `assignment` DROP FOREIGN KEY `FK_120fccbd6a68efddd56d49559f4`");
        await queryRunner.query("ALTER TABLE `assignment` DROP FOREIGN KEY `FK_b3ae3ab674b9ba61a5771e906da`");
        await queryRunner.query("DROP TABLE `assignment`");
    }

}
