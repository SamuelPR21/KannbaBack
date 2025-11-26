import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeTaskHistory1764134153405 implements MigrationInterface {
    name = 'AddCascadeTaskHistory1764134153405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_384a52d3e0409d4b6757867282b"`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_384a52d3e0409d4b6757867282b" FOREIGN KEY ("task_proyect_id") REFERENCES "task_proyect"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_384a52d3e0409d4b6757867282b"`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_384a52d3e0409d4b6757867282b" FOREIGN KEY ("task_proyect_id") REFERENCES "task_proyect"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
