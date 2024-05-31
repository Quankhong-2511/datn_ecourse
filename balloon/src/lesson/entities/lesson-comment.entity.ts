import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { getTitle } from '../../utils/index';
import { Lesson } from './lesson.entity';
import { Notifications } from 'src/notification/entities/notifications.entity';

@Entity('lesson_comment')
export class LessonComment extends BaseEntity {
  @Column({ name: 'lesson_id' })
  lessonId: number;

  @Column({ type: String, nullable: true })
  file: string;

  @Column({ type: String, nullable: true })
  content: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdByName: User;

  @ManyToOne((_type) => Lesson, (lesson) => lesson.comments)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Exclude()
  @Column({ insert: false, update: false, select: false })
  files: string;

  @BeforeInsert()
  @BeforeUpdate()
  convertPublish() {
    this.file = JSON.stringify(this.files);
  }

  title: string;

  @OneToMany((_type) => Notifications, (notifications) => notifications.lessonComment, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  notifications: Notifications;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  convertPublishToArray() {
    const images = typeof this.file === 'string' ? JSON.parse(this.file) : JSON.parse(JSON.stringify(this.file));
    this.file = images ?? [];

    this.title = getTitle(this.content);
  }
}
