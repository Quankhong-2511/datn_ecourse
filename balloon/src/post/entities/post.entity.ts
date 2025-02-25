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
import { PostComment } from './post-comment.entity';
import { Notifications } from 'src/notification/entities/notifications.entity';

@Entity()
export class Post extends BaseEntity {
  @Column({ name: 'course_id' })
  @Expose()
  courseId: number;

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

  @OneToMany((_type) => PostComment, (comment) => comment.post)
  comments: PostComment[];

  @OneToOne((_type) => PostComment, (comment) => comment.post)
  commentsTop: PostComment;

  @Expose()
  @OneToOne((_type) => User, (user) => user.post, { eager: true })
  @JoinColumn({ name: 'created_by' })
  user: User;

  @Exclude()
  @Column({ insert: false, update: false, select: false })
  files: string;

  title: string;

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
