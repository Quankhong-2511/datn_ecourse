import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldCourse1715072104165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "content" VARCHAR`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "discount"`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "commission"`);
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "price" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "discount" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "commission" DECIMAL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "content"`);
  }
}
