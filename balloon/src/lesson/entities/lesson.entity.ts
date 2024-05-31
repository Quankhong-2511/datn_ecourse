import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { getTitle } from '../../utils/index';
import { Course } from 'src/course/entities/course.entity';
import { LessonComment } from './lesson-comment.entity';
import { Notifications } from 'src/notification/entities/notifications.entity';

@Entity()
export class Lesson extends BaseEntity {
  @Column({ name: 'course_id' })
  @Expose()
  courseId: number;

  @Column({ type: String })
  @Expose()
  name: string;

  @Column({ type: String })
  @Expose()
  content: string;

  @Column({ type: String, nullable: true })
  @Expose()
  file: string;

  @Column({ type: Number, nullable: true })
  @Expose()
  publish: number;

  @Column({ type: String })
  @Expose()
  tag: string;

  @Column({ name: 'created_by' })
  @Expose()
  createdBy: number;

  @Column({ type: String, nullable: true })
  reason: string;
  
  @OneToMany((_type) => LessonComment, (comment) => comment.lesson, { eager: true })
  comments: LessonComment[];

  @OneToOne((_type) => LessonComment, (comment) => comment.lesson)
  commentsTop: LessonComment;

  @Column({ type: String, default: 'Chờ duyệt' })
  status: string;

  @Expose()
  @OneToOne((_type) => User, (user) => user.lesson, { eager: true })
  @JoinColumn({ name: 'created_by' })
  user: User;

  @Expose()
  @OneToOne((_type) => Course, (course) => course.lesson, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Exclude()
  @Column({ insert: false, update: false, select: false })
  files: string;

  title: string;

  @OneToMany((_type) => Notifications, (notifications) => notifications.lesson, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  notifications: Notifications;

  @BeforeInsert()
  @BeforeUpdate()
  convertPublish() {
    this.file = JSON.stringify(this.files);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  convertPublishToArray() {
    const images = typeof this.file === 'string' ? JSON.parse(this.file) : JSON.parse(JSON.stringify(this.file));
    this.file = images ?? [];
    this.title = getTitle(this.content);
  }
}
