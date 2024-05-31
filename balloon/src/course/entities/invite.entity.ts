import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('invite')
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: true })
  uuid: string;

  @Column({ name: 'user_id', type: Number })
  userId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'course_name' })
  courseName: string;

  @Column({ name: 'course_id', type: Number })
  courseId: number;

  @Column({ type: String, nullable: true })
  email: string;

  @Column({ name: 'role', type: Number })
  role: number;

  @Column({ name: 'sender', type: Number })
  sender: number;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'price', type: Number })
  price: number;

  @Column({ name: 'commission', type: Number })
  commission: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: () => 'NULL', select: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, default: () => 'NULL', select: false })
  deletedAt: Date;
}
