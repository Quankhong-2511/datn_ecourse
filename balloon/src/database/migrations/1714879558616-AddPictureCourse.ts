import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPictureCourse1714879558616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" ADD COLUMN "file" JSONB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "file"`);
  }
}
