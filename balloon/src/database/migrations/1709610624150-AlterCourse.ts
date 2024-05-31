import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCourse1709610624150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "teacher" INT`);
    await queryRunner.query(`ALTER TABLE "invite" ADD COLUMN "commission" INT`);
    await queryRunner.query(`ALTER TABLE "member" ADD COLUMN "reduced" INT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "teacher"`);
    await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "commission"`);
    await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "reduced"`);
  }
}
