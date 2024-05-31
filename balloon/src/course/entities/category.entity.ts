import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ type: String })
  title: string;

  @OneToMany((_type) => Course, (course) => course.categoryInfo, {
    lazy: true,
    onDelete: "CASCADE",
  })
  course: Course;

}
