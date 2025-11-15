import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteWeightKgToPetTable1763172597285 implements MigrationInterface {
    name = 'DeleteWeightKgToPetTable1763172597285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "weightKg"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" ADD "weightKg" integer NOT NULL`);
    }

}
