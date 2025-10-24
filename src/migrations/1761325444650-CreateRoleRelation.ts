import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleRelation1761325444650 implements MigrationInterface {
    name = 'CreateRoleRelation1761325444650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_proyect" RENAME COLUMN "rol" TO "role_id"`);
        await queryRunner.query(`ALTER TYPE "public"."user_proyect_rol_enum" RENAME TO "user_proyect_role_id_enum"`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_proyect" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "user_proyect" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_proyect" ADD CONSTRAINT "FK_0b8c1d4e891eb46a31f746f7974" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_proyect" DROP CONSTRAINT "FK_0b8c1d4e891eb46a31f746f7974"`);
        await queryRunner.query(`ALTER TABLE "user_proyect" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "user_proyect" ADD "role_id" "public"."user_proyect_role_id_enum" NOT NULL DEFAULT 'MANAGER'`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`ALTER TYPE "public"."user_proyect_role_id_enum" RENAME TO "user_proyect_rol_enum"`);
        await queryRunner.query(`ALTER TABLE "user_proyect" RENAME COLUMN "role_id" TO "rol"`);
    }

}
