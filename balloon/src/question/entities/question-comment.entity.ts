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
import { Question } from './question.entity';
import { Notifications } from 'src/notification/entities/notifications.entity';

@Entity('question_comment')
export class QuestionComment extends BaseEntity {
  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ type: String, nullable: true })
  file: string;

  @Column({ type: String, nullable: true })
  content: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByName: User;

  @ManyToOne((_type) => Question, (question) => question.comments)
  @JoinColumn({ name: 'question_id' })
  question: Question;

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
