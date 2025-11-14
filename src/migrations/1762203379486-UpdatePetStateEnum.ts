import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePetStateEnum1762203379486 implements MigrationInterface {
    name = 'UpdatePetStateEnum1762203379486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pet_state_enum" RENAME TO "pet_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pet_state_enum" AS ENUM('FELIZ', 'HAMBRIENTO', 'MUERTO')`);
        await queryRunner.query(`ALTER TABLE "pet" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pet" ALTER COLUMN "state" TYPE "public"."pet_state_enum" USING "state"::text::"public"."pet_state_enum"`);
        await queryRunner.query(`ALTER TABLE "pet" ALTER COLUMN "state" SET DEFAULT 'HAMBRIENTO'`);
        await queryRunner.query(`DROP TYPE "public"."pet_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pet_state_enum_old" AS ENUM('FELIZ', 'HAMBIRENTO', 'MUERTO')`);
        await queryRunner.query(`ALTER TABLE "pet" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pet" ALTER COLUMN "state" TYPE "public"."pet_state_enum_old" USING "state"::text::"public"."pet_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pet" ALTER COLUMN "state" SET DEFAULT 'HAMBIRENTO'`);
        await queryRunner.query(`DROP TYPE "public"."pet_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pet_state_enum_old" RENAME TO "pet_state_enum"`);
    }
}
