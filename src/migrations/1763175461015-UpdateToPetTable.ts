import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateToPetTable1763175461015 implements MigrationInterface {
    name = 'UpdateToPetTable1763175461015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" RENAME COLUMN "date_last_meal" TO "date_creation"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" RENAME COLUMN "date_creation" TO "date_last_meal"`);
    }

}
