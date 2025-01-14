import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCourse1714875908653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "category" (
            "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            "title" VARCHAR,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            "updated_at" TIMESTAMP DEFAULT NULL,
            "deleted_at" TIMESTAMP DEFAULT NULL
        );
    `);

    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "category" INT`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "publish"`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "tag"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE category;");
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "category"`);
    await queryRunner.query(`ALTER TABLE "lesson" ADD COLUMN "publish" INT`);
    await queryRunner.query(`ALTER TABLE "lesson" ADD COLUMN "tag" VARCHAR`);
  }
}
