import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableCommission1716397654497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "commission" (
            "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            "commission" INT NOT NULL,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            "updated_at" TIMESTAMP DEFAULT NULL,
            "deleted_at" TIMESTAMP DEFAULT NULL
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE commission`)
  }
}
