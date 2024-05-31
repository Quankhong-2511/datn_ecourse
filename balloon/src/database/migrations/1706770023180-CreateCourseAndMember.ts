import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatecourseAndMember1706770023180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS course');
    await queryRunner.query('DROP TABLE IF EXISTS member');
    await queryRunner.query(`
          CREATE TABLE "course" (
            "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            "name" VARCHAR(255) NOT NULL,
            "created_by" BIGINT,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            "updated_at" TIMESTAMP DEFAULT NULL,
            "deleted_at" TIMESTAMP DEFAULT NULL
          )
        `);
    await queryRunner.query(`
          CREATE TABLE "member" (
            "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            "user_id" BIGINT NOT NULL,
            "course_id" BIGINT NOT NULL,
            "phone"  VARCHAR(20),
            "role" INT,
            "status" INT,
            "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
            "updated_at" TIMESTAMP,
            "deleted_at" TIMESTAMP
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE course`);
    await queryRunner.query('DROP TABLE member');
  }
}