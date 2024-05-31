import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInvite1707064728584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "commission" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "tuition_fees" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "paid" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "teacher" BOOLEAN`);
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "price" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "discount" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "last_price" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "commission" DECIMAL`);
    await queryRunner.query(`
        CREATE TABLE "invite" (
            "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
            "user_id" BIGINT NOT NULL,
            "course_name" VARCHAR(255),
            "course_id" BIGINT,
            "email" VARCHAR,
            "name" VARCHAR(255),
            "role" SMALLINT ,
            "phone" VARCHAR(15),
            "price" DECIMAL,
            "sender" BIGINT NOT NULL,
            "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
            "updated_at" TIMESTAMP,
            "deleted_at" TIMESTAMP
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "commission"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tuition_fees"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "paid"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "teacher"`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "discount" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "last_price" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "commission" DECIMAL`);
    await queryRunner.query(`DROP TABLE "invite"`);
  }
}
