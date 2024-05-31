import { AppConstant } from 'src/utils/app.constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTriggrer1717092072846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER lesson_notification ON lesson;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_lesson;`);

    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION create_notification_for_lesson()
    RETURNS TRIGGER AS $$
    DECLARE
        member RECORD;
    BEGIN
        -- Condition for when the status is updated to 'Đã duyệt'
        IF NEW.status = 'Đã duyệt' AND OLD.status = 'Chờ duyệt' THEN
            INSERT INTO notifications(type, content, reference_id)
            VALUES (${AppConstant.NOTIFICATION_TYPE_LESSON}, 'Có bài học mới duyệt', NEW.id);
        
            FOR member IN SELECT user_id FROM member WHERE course_id = NEW.course_id AND status = ${AppConstant.STATUS_MEMBER_PASS}
            LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
            END LOOP;
        -- Condition for when the status is updated to 'Hủy'
        ELSIF NEW.status = 'Hủy' AND OLD.status != 'Hủy' THEN
            INSERT INTO notifications(type, content, reference_id)
            VALUES (${AppConstant.NOTIFICATION_TYPE_CANCEL_LESSON}, 'Bài học đã bị hủy', NEW.id);
            
            FOR member IN SELECT user_id FROM member WHERE course_id = NEW.course_id AND role = 1
            LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
            END LOOP;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
        CREATE TRIGGER lesson_notification
        AFTER UPDATE ON lesson
        FOR EACH ROW
        EXECUTE FUNCTION create_notification_for_lesson();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER lesson_notification ON lesson;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_lesson;`);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_lesson()
        RETURNS TRIGGER AS $$
        DECLARE
            member RECORD;
        BEGIN
            IF NEW.status = 'Đã duyệt' AND OLD.status = 'Chờ duyệt' THEN
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_LESSON}, 'Có bài học mới duyệt', NEW.id);
        
                FOR member IN SELECT user_id FROM member WHERE course_id = NEW.course_id AND status = ${AppConstant.STATUS_MEMBER_PASS}
                LOOP
                    INSERT INTO recipients(user_id, notifications_id)
                    VALUES (member.user_id, currval('notifications_id_seq'));
                END LOOP;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
        CREATE TRIGGER lesson_notification
        AFTER UPDATE ON lesson
        FOR EACH ROW
   
        EXECUTE FUNCTION create_notification_for_lesson();
    `);
  }
}
