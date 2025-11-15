import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePetFeedTable1763172317242 implements MigrationInterface {
    name = 'CreatePetFeedTable1763172317242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pet_feed" ("id" SERIAL NOT NULL, "fed_at" TIMESTAMP NOT NULL DEFAULT now(), "pet_id" integer, "fed_by_user_id" integer, CONSTRAINT "PK_cbe4c76dac80ca0df3eaa846f68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pet_feed" ADD CONSTRAINT "FK_8f5601135d7b1bf58ba101f65d2" FOREIGN KEY ("pet_id") REFERENCES "pet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pet_feed" ADD CONSTRAINT "FK_7abb4f1634811d06ad3daf19db1" FOREIGN KEY ("fed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet_feed" DROP CONSTRAINT "FK_7abb4f1634811d06ad3daf19db1"`);
        await queryRunner.query(`ALTER TABLE "pet_feed" DROP CONSTRAINT "FK_8f5601135d7b1bf58ba101f65d2"`);
        await queryRunner.query(`DROP TABLE "pet_feed"`);
    }

}
