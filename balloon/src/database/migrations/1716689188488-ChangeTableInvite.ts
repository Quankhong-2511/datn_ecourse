import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTableInvite1716689188488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS invite;');
    await queryRunner.query(`
        CREATE TABLE "invite" (
            "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            "uuid" VARCHAR,
            "user_id" BIGINT,
            "course_name" VARCHAR(255),
            "course_id" BIGINT,
            "email" VARCHAR,
            "name" VARCHAR(255),
            "role" SMALLINT ,
            "phone" VARCHAR(15),
            "price" DECIMAL,
            "commission" INT, 
            "sender" BIGINT NOT NULL,
            "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
            "updated_at" TIMESTAMP,
            "deleted_at" TIMESTAMP
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE invite;');
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
}