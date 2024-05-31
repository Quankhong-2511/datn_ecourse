import { MigrationInterface, QueryRunner } from 'typeorm';

export class RevertLesson1714897553400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" ADD COLUMN "publish" INT`);
    await queryRunner.query(`ALTER TABLE "lesson" ADD COLUMN "tag" VARCHAR`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "publish" INT`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "tag" VARCHAR`);
  }
}
