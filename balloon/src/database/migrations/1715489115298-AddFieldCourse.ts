import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldCourse1715489115298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "revenue" DECIMAL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "revenue"`);
  }
}
