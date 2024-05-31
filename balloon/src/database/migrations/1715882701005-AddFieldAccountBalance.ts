import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldAccountBalance1715882701005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "extra_money" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "available_balances" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "user_id" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "extra_money"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "available_balances"`);
  }
}
