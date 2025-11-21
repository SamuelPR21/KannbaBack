import { MigrationInterface, QueryRunner } from "typeorm";

export class UpDataBase1763748843629 implements MigrationInterface {
    name = 'UpDataBase1763748843629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proyects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "categoryId" integer, CONSTRAINT "PK_b665987521852d1f3d45755ee4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pet_type_enum" AS ENUM('GATO', 'PERRO')`);
        await queryRunner.query(`CREATE TYPE "public"."pet_state_enum" AS ENUM('FELIZ', 'HAMBRIENTO', 'MUERTO')`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" SERIAL NOT NULL, "type" "public"."pet_type_enum" NOT NULL DEFAULT 'GATO', "state" "public"."pet_state_enum" NOT NULL DEFAULT 'HAMBRIENTO', "date_creation" TIMESTAMP NOT NULL, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_proyect" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "usuario_proyecto_id" integer, "estado_id" integer, CONSTRAINT "PK_d8116be9585484f5ce15521bbb0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."state_name_enum" AS ENUM('BACKLOG', 'TO_DO', 'DOING', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "state" ("id" SERIAL NOT NULL, "name" "public"."state_name_enum" NOT NULL DEFAULT 'BACKLOG', CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_personal" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "user_id" integer, "estado_id" integer, CONSTRAINT "PK_73d78b22c8e1e78adb8d9502d97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_purpose_enum" AS ENUM('ESTUDIO', 'TRABAJO', 'PERSONAL')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "nameComlpete" character varying NOT NULL, "password" character varying NOT NULL, "oficio" character varying NOT NULL, "dateOfBirth" TIMESTAMP NOT NULL, "purpose" "public"."users_purpose_enum" NOT NULL DEFAULT 'ESTUDIO', "petId" integer, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_75503c6219452071189f16a180" UNIQUE ("petId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_proyect" ("id" SERIAL NOT NULL, "proyect_id" integer, "user_id" integer, "role_id" integer, CONSTRAINT "PK_51d81ba7819c4411621cca78953" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_history" ("id" SERIAL NOT NULL, "changedAt" TIMESTAMP NOT NULL DEFAULT now(), "task_personal_id" integer, "task_proyect_id" integer, "old_state_id" integer, "new_state_id" integer, CONSTRAINT "PK_716670443aea4a2f4a599bb7c53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pet_feed" ("id" SERIAL NOT NULL, "fed_at" TIMESTAMP NOT NULL DEFAULT now(), "pet_id" integer, "fed_by_user_id" integer, CONSTRAINT "PK_cbe4c76dac80ca0df3eaa846f68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "proyects" ADD CONSTRAINT "FK_c09d203eadcb1a08bf1682359e7" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_proyect" ADD CONSTRAINT "FK_4ca88a3e5db14da0e9dac6bd99a" FOREIGN KEY ("usuario_proyecto_id") REFERENCES "user_proyect"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_proyect" ADD CONSTRAINT "FK_5e00fabbb8ebbe4ea66fe313a32" FOREIGN KEY ("estado_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_personal" ADD CONSTRAINT "FK_1c1e7497e9d3f3ddc3ea9c00822" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_personal" ADD CONSTRAINT "FK_da507b8c0d4ccf17aad50d27f15" FOREIGN KEY ("estado_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_75503c6219452071189f16a180a" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_proyect" ADD CONSTRAINT "FK_9f807ed8ec916dcbaab2b1df9f7" FOREIGN KEY ("proyect_id") REFERENCES "proyects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_proyect" ADD CONSTRAINT "FK_8d3eb0e052dbdcd70985d4144b7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_proyect" ADD CONSTRAINT "FK_0b8c1d4e891eb46a31f746f7974" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_4e56cc9065ed5b61deae7057035" FOREIGN KEY ("task_personal_id") REFERENCES "task_personal"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_384a52d3e0409d4b6757867282b" FOREIGN KEY ("task_proyect_id") REFERENCES "task_proyect"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_b31a1a78c89a660ce9b58088713" FOREIGN KEY ("old_state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_c58bfa6d8e22254c6bebb075700" FOREIGN KEY ("new_state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pet_feed" ADD CONSTRAINT "FK_8f5601135d7b1bf58ba101f65d2" FOREIGN KEY ("pet_id") REFERENCES "pet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pet_feed" ADD CONSTRAINT "FK_7abb4f1634811d06ad3daf19db1" FOREIGN KEY ("fed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet_feed" DROP CONSTRAINT "FK_7abb4f1634811d06ad3daf19db1"`);
        await queryRunner.query(`ALTER TABLE "pet_feed" DROP CONSTRAINT "FK_8f5601135d7b1bf58ba101f65d2"`);
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_c58bfa6d8e22254c6bebb075700"`);
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_b31a1a78c89a660ce9b58088713"`);
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_384a52d3e0409d4b6757867282b"`);
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_4e56cc9065ed5b61deae7057035"`);
        await queryRunner.query(`ALTER TABLE "user_proyect" DROP CONSTRAINT "FK_0b8c1d4e891eb46a31f746f7974"`);
        await queryRunner.query(`ALTER TABLE "user_proyect" DROP CONSTRAINT "FK_8d3eb0e052dbdcd70985d4144b7"`);
        await queryRunner.query(`ALTER TABLE "user_proyect" DROP CONSTRAINT "FK_9f807ed8ec916dcbaab2b1df9f7"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_75503c6219452071189f16a180a"`);
        await queryRunner.query(`ALTER TABLE "task_personal" DROP CONSTRAINT "FK_da507b8c0d4ccf17aad50d27f15"`);
        await queryRunner.query(`ALTER TABLE "task_personal" DROP CONSTRAINT "FK_1c1e7497e9d3f3ddc3ea9c00822"`);
        await queryRunner.query(`ALTER TABLE "task_proyect" DROP CONSTRAINT "FK_5e00fabbb8ebbe4ea66fe313a32"`);
        await queryRunner.query(`ALTER TABLE "task_proyect" DROP CONSTRAINT "FK_4ca88a3e5db14da0e9dac6bd99a"`);
        await queryRunner.query(`ALTER TABLE "proyects" DROP CONSTRAINT "FK_c09d203eadcb1a08bf1682359e7"`);
        await queryRunner.query(`DROP TABLE "pet_feed"`);
        await queryRunner.query(`DROP TABLE "task_history"`);
        await queryRunner.query(`DROP TABLE "user_proyect"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_purpose_enum"`);
        await queryRunner.query(`DROP TABLE "task_personal"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TYPE "public"."state_name_enum"`);
        await queryRunner.query(`DROP TABLE "task_proyect"`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`DROP TYPE "public"."pet_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pet_type_enum"`);
        await queryRunner.query(`DROP TABLE "proyects"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
