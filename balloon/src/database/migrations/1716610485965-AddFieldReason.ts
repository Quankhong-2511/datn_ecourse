import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldReason1716610485965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" ADD COLUMN "reason" VARCHAR`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "reason"`);

  }
}
