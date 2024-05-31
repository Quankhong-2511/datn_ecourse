import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableFile1706790508814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD COLUMN name VARCHAR;`);
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN phone VARCHAR;`);
    await queryRunner.query(`ALTER TABLE "member" DROP COLUMN phone;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN name;`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN phone;`);
    await queryRunner.query(`ALTER TABLE "member" ADD COLUMN phone VARCHAR;`);
  }
}
