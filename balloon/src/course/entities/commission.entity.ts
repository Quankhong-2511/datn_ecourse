import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Commission extends BaseEntity {
  @Column({ type: Number })
  level_1: number;

  @Column({ type: Number })
  level_2: number;

  @Column({ type: Number })
  level_3: number;

  @Column({ type: Number })
  level_4: number;

  @Column({ type: Number })
  level_5: number;
}
