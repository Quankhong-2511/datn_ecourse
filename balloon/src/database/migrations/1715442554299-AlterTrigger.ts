import { AppConstant } from 'src/utils/app.constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTrigger1715442554299 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER question_notification ON question;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_question;`);

    await queryRunner.query(`DROP TRIGGER question_comment_notification ON question_comment;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_question_comment;`);

    await queryRunner.query(`DROP TRIGGER lesson_notification ON lesson;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_lesson;`);

    await queryRunner.query(`DROP TRIGGER lesson_comment_notification ON lesson_comment;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_lesson_comment;`);

    await queryRunner.query(`DROP TRIGGER post_notification ON post;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_post;`);

    await queryRunner.query(`DROP TRIGGER post_comment_notification ON post_comment;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_post_comment;`);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_lesson()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
            BEGIN
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_LESSON}, 'Có bài học mới ', NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = NEW.course_id AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER lesson_notification
            AFTER INSERT ON lesson
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_lesson();
        `);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_lesson_comment()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
                cou_id  INT;
            BEGIN
                SELECT course_id INTO cou_id FROM lesson WHERE id = NEW.lesson_id;
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_LESSON_COMMENT}, 'Có comment mới ở bài học', NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = cou_id  AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER lesson_comment_notification
            AFTER INSERT ON lesson_comment
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_lesson_comment();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_question()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
            BEGIN
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_QUESTION}, 'Có câu hỏi mới ' || NEW.publish, NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = NEW.course_id AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER question_notification
            AFTER INSERT ON question
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_question();
        `);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_question_comment()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
                cou_id  INT;
            BEGIN
                SELECT course_id INTO cou_id FROM question WHERE id = NEW.question_id;
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_QUESTION_COMMENT}, 'Có comment mới ở câu hỏi', NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = cou_id  AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER question_comment_notification
            AFTER INSERT ON question_comment
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_question_comment();
        `);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_lesson()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
            BEGIN
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_LESSON}, 'Có bài học mới ' || NEW.publish, NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = NEW.course_id AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER lesson_notification
            AFTER INSERT ON lesson
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_lesson();
        `);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_lesson_comment()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
                cou_id  INT;
            BEGIN
                SELECT course_id INTO cou_id FROM lesson WHERE id = NEW.lesson_id;
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_LESSON_COMMENT}, 'Có comment mới ở bài học', NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = cou_id  AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER lesson_comment_notification
            AFTER INSERT ON lesson_comment
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_lesson_comment();
        `);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_post()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
            BEGIN
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_POST}, 'Có bài viết mới ' || NEW.publish, NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = NEW.course_id AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER post_notification
            AFTER INSERT ON post
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_post();
        `);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION create_notification_for_post_comment()
        RETURNS TRIGGER AS $$
            DECLARE
                member RECORD;
                cou_id  INT;
            BEGIN
                SELECT course_id INTO cou_id FROM post WHERE id = NEW.lesson_id;
                INSERT INTO notifications(type, content, reference_id)
                VALUES (${AppConstant.NOTIFICATION_TYPE_POST_COMMENT}, 'Có comment mới ở bài viết', NEW.id);
                FOR member IN SELECT user_id FROM member WHERE course_id = cou_id  AND status = ${AppConstant.STATUS_MEMBER_PASS}
                    LOOP
                INSERT INTO recipients(user_id, notifications_id)
                VALUES (member.user_id, currval('notifications_id_seq'));
                    END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER post_comment_notification
            AFTER INSERT ON post_comment
            FOR EACH ROW
            EXECUTE FUNCTION create_notification_for_post_comment();
        `);

    await queryRunner.query(`DROP TRIGGER lesson_notification ON lesson;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_lesson;`);

    await queryRunner.query(`DROP TRIGGER lesson_comment_notification ON lesson_comment;`);
    await queryRunner.query(`DROP FUNCTION create_notification_for_lesson_comment;`);
  }
}
