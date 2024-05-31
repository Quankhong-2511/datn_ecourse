import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notifications.entity';
import { Recipients } from './entities/recipients.entity';
import { ShareModule } from 'src/utils/share.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications, Recipients]), ShareModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
