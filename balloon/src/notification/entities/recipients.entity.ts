import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Notifications } from './notifications.entity';

@Entity()
export class Recipients extends BaseEntity {
  @Column({ name: 'user_id', type: Number })
  userId: number;

  @Column({ name: 'notifications_id', type: Number })
  notificationId: number;

  @Column({ name: 'status_cd', type: Number, default: 0 })
  statusCd: number;

  @ManyToOne((_type) => Notifications, (notifications) => notifications.recipients)
  @JoinColumn({ name: 'notifications_id' })
  notifications: Notifications;

  @ManyToOne((_type) => User, (user) => user.recipients)
  @JoinColumn({ name: 'user_id' })
  recipients: User;
}
