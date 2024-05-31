import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Course } from './course.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Member extends BaseEntity {
  @Column({ name: 'user_id', type: Number })
  userId: number;

  @Column({ name: 'course_id', type: Number })
  courseId: number;

  @Column({ name: 'role', type: Number })
  role: number;

  @Column({ name: 'status', type: Number })
  status: number;

  @Column({ name: 'reduced', type: "decimal", nullable: true })
  reduced: number;

  @Column({ name: 'price', type: Number })
  price: number;

  @ManyToOne((_type) => Course, (course) => course.members, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne((_type) => User, (user) => user.members, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
