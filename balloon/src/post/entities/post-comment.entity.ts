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
import { Post } from './post.entity';
import { Notifications } from 'src/notification/entities/notifications.entity';

@Entity('post_comment')
export class PostComment extends BaseEntity {
  @Column({ name: 'post_id' })
  postId: number;

  @Column({ type: String, nullable: true })
  file: string;

  @Column({ type: String, nullable: true })
  content: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByName: User;

  @ManyToOne((_type) => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Exclude()
  @Column({ insert: false, update: false, select: false })
  files: string;

  @BeforeInsert()
  @BeforeUpdate()
  convertPublish() {
    this.file = JSON.stringify(this.files);
  }

  title: string;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  convertPublishToArray() {
    const images = typeof this.file === 'string' ? JSON.parse(this.file) : JSON.parse(JSON.stringify(this.file));
    this.file = images ?? [];

    this.title = getTitle(this.content);
  }
}
