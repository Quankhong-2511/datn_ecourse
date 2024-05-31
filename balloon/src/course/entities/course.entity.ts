import { BaseEntity } from 'src/utils/entity/base.entity';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Member } from './member.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Post } from 'src/post/entities/post.entity';
import { Question } from 'src/question/entities/question.entity';
import { Category } from './category.entity';
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Commission } from './commission.entity';

@Entity()
export class Course extends BaseEntity {
  @Index()
  @Column({ type: String })
  name: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @Column({ type: Number })
  price: number;

  @Column({ type: Number })
  discount: number;

  @Column({ type: Number, name: 'last_price' })
  lastPrice: number;

  @Column({ type: Number })
  commission: number;

  @Column({ type: String })
  content: string;

  @Column({ type: Number })
  revenue: number;

  @Column({ type: Number, name: "category" })
  category: number;

  @Column({ type: String, nullable: true })
  @Expose()
  file: string;
      
  @Exclude()
  @Column({ insert: false, update: false, select: false })
  files: string;

  @Column({ type: Number })
  teacher: number;

  @Column({ type: String })
  status: string;

  @OneToMany((_type) => Member, (member) => member.course, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  members: Member;

  @OneToOne((_type) => Lesson, (lesson) => lesson.course, {
    lazy: true,
  })
  lesson: Lesson;

  @ManyToOne((_type) => Category, (categoryInfo) => categoryInfo.course, {
    lazy: true,
  })
  @JoinColumn({ name: "category" })
  categoryInfo: Category;

  @Expose()
  @OneToOne((_type) => User, (user) => user.lesson, { eager: true })
  @JoinColumn({ name: 'teacher' })
  user: User;

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  async updatePrice() {
    if (this.price && this.discount !== null) {
      this.lastPrice = this.price - (this.price * this.discount) / 100;
    } else {
      this.lastPrice = this.price;
    }
  }

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
  }
}
