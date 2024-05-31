import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldCheckCourseLesson1715790954622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "status" VARCHAR DEFAULT 'Chờ duyệt'`);
    await queryRunner.query(`ALTER TABLE "lesson" ADD COLUMN "status" VARCHAR DEFAULT 'Chờ duyệt'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "status"`);
  }
}
