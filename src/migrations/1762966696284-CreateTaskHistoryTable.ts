import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskHistoryTable1762966696284 implements MigrationInterface {
    name = 'CreateTaskHistoryTable1762966696284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_history" ("id" SERIAL NOT NULL, "changedAt" TIMESTAMP NOT NULL DEFAULT now(), "task_personal_id" integer, "task_proyect_id" integer, "old_state_id" integer, "new_state_id" integer, CONSTRAINT "PK_716670443aea4a2f4a599bb7c53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_4e56cc9065ed5b61deae7057035" FOREIGN KEY ("task_personal_id") REFERENCES "task_personal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_384a52d3e0409d4b6757867282b" FOREIGN KEY ("task_proyect_id") REFERENCES "task_proyect"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_b31a1a78c89a660ce9b58088713" FOREIGN KEY ("old_state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_c58bfa6d8e22254c6bebb075700" FOREIGN KEY ("new_state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_c58bfa6d8e22254c6bebb075700"`);
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_b31a1a78c89a660ce9b58088713"`);
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_384a52d3e0409d4b6757867282b"`);
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_4e56cc9065ed5b61deae7057035"`);
        await queryRunner.query(`DROP TABLE "task_history"`);
    }

}
