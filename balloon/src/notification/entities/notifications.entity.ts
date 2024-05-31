import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Question } from 'src/question/entities/question.entity';
import { QuestionComment } from 'src/question/entities/question-comment.entity';
import { Recipients } from './recipients.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { LessonComment } from 'src/lesson/entities/lesson-comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { PostComment } from 'src/post/entities/post-comment.entity';

@Entity('notifications')
export class Notifications extends BaseEntity {
  @Column()
  type: number;

  @Column({ type: String })
  content: string;

  @Column({ name: 'reference_id' })
  referenceId: number;

  @ManyToOne((_type) => Lesson, (lesson) => lesson.notifications, {eager: true})
  @JoinColumn({ name: 'reference_id' })
  lesson: Lesson;

  @ManyToOne((_type) => LessonComment, (lessonComment) => lessonComment.notifications, {eager: true})
  @JoinColumn({ name: 'reference_id' })
  lessonComment: LessonComment;

  @OneToMany(() => Recipients, (recipient) => recipient.notifications)
  recipients: Recipients[];
}
