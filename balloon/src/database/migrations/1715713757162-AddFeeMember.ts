import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeeMember1715713757162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "member" ADD COLUMN "price" DECIMAL`);
    await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "reduced" TYPE DECIMAL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "reduced" TYPE INTERGER`);
  }
}
