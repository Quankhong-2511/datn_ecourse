import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import bcrypt from 'bcryptjs';
import { EntityHelper } from 'src/utils/entity-helper';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { Exclude, Expose } from 'class-transformer';
import { getValueOrDefault } from 'src/utils';
import { Member } from 'src/course/entities/member.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Post } from 'src/post/entities/post.entity';
import { Question } from 'src/question/entities/question.entity';
import { Recipients } from 'src/notification/entities/recipients.entity';
import { Course } from 'src/course/entities/course.entity';

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  // @Expose({ groups: ['me', 'admin', 'login'] })
  email: string | null;

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  otpSecret: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['login'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['login'] })
  socialId: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  name: string | null;

  @ManyToOne(() => Role, {
    eager: true,
  })
  @Expose({ groups: ['login'] })
  role?: Role | null;

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @Column({ type: String, nullable: true })
  phone: string;

  @Column({ type: Boolean, default: false })
  teacher: boolean;

  @Column({ name: 'commission', type: Number, nullable: true })
  commission: number;

  @Column({ name: 'tuition_fees', type: Number, nullable: true })
  tuitionFees: number;

  @Column({ name: 'paid', type: Number, nullable: true })
  paid: number;

  @Column({ name: 'extra_money', type: Number, nullable: true })
  extraMoney: number;

  @Column({ name: 'available_balances', type: Number, nullable: true })
  availableBalances: number;

  // debt = tuitionFees - paid
  debt: number;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @Column({ type: String, nullable: true })
  describe: string | null;

  @Column({ type: String, nullable: true })
  file: string;

  @Exclude()
  @Column({ insert: false, update: false, select: false })
  files: string;

  @OneToMany((_type) => Member, (member) => member.user, {
    eager: false,
    onDelete: 'CASCADE',
  })
  members: Member[];

  @Expose({ groups: ['login'] })
  @OneToOne((_type) => Lesson, (lesson) => lesson.user, {
    eager: false,
  })
  lesson: Lesson;

  @Expose({ groups: ['login'] })
  @OneToOne((_type) => Post, (post) => post.user, {
    eager: false,
  })
  post: Post;

  @Expose({ groups: ['login'] })
  @OneToOne((_type) => Question, (question) => question.user, {
    eager: false,
  })
  question: Question;

  @OneToMany((_type) => Recipients, (recipient) => recipient.recipients, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @Expose({ groups: ['login'] })
  recipients: Recipients;

  @Expose({ groups: ['login'] })
  @OneToOne((_type) => Course, (course) => course.user, {
    eager: false,
  })
  course: Course;

  @BeforeInsert()
  @BeforeUpdate()
  convertFile() {
    this.file = JSON.stringify(this.files);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  convertPublishToArray() {
    const images = getValueOrDefault(this.file, []);
    this.file = typeof images === 'string' ? JSON.parse(images) : JSON.parse(JSON.stringify(images));
    this.debt = this.tuitionFees - this.paid - this.commission;
  }
}
