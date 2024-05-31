import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notifications.entity';
import { Repository } from 'typeorm';
import { AppConstant } from 'src/utils/app.constant';
import { FilterNotificationDto } from './dto/filter-notifications.dto';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { Recipients } from './entities/recipients.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
    @InjectRepository(Recipients)
    private recipientsRepository: Repository<Recipients>,
  ) {}

  async list(filter: FilterNotificationDto, userId: number) {
    const createNotificationQuery = (type: number) => {
      const query = this.notificationsRepository
        .createQueryBuilder('Notifications')
        .innerJoin('Notifications.recipients', 'recipients')
        .addSelect('recipients.statusCd')
        .where('Notifications.type = :type', { type: type })
        .andWhere('recipients.userId = :userId', { userId: userId });

      if (filter.year) {
        query.andWhere(`EXTRACT(YEAR FROM Notifications.created_at) = :year`, { year: filter.year });
      }

      if (filter.filter3month) {
        const currentDate = new Date();
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + 1 - filter.filter3month);
        currentDate.setHours(0, 0, 0, 0);
        query.andWhere('Notifications.created_at >= :date', { date: currentDate });
      }

      return query;
    };

    const notificationLesson = await createNotificationQuery(AppConstant.NOTIFICATION_TYPE_LESSON)
      .withDeleted()
      .leftJoinAndSelect('Notifications.lesson', 'lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.user', 'user')
      .getMany();

    const notificationCancelLesson = await createNotificationQuery(AppConstant.NOTIFICATION_TYPE_CANCEL_LESSON)
      .withDeleted()
      .leftJoinAndSelect('Notifications.lesson', 'lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.user', 'user')
      .getMany();

    const notificationLessonComment = await createNotificationQuery(AppConstant.NOTIFICATION_TYPE_LESSON_COMMENT)
      .withDeleted()
      .leftJoinAndSelect('Notifications.lessonComment', 'lessonComment')
      .leftJoinAndSelect('lessonComment.lesson', 'lesson')
      .leftJoinAndSelect('lessonComment.createdByName', 'createdByName')
      .leftJoinAndSelect('lesson.course', 'course')
      .getMany();

    let notifications = [
      ...notificationLesson,
      ...notificationLessonComment,
      ...notificationCancelLesson
    ];

    notifications = notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const formattedNotifications = notifications.map(notification => {
      if (notification.lesson) {
        return {
          id: notification.id, 
          content: notification.lesson.content,
          type: notification.type,
          courseId: notification.lesson.course.id,
          courseName: notification.lesson.course.name,
          lessonId: notification.lesson.id,
          lessonName: notification.lesson.name,
          userId: notification.lesson.user.id,
          status:  notification.recipients.map((e) => e.statusCd)
        };
      } else if (notification.lessonComment) {
        return {
          id: notification.id, 
          content: notification.lessonComment.content,
          type: notification.type,
          courseId: notification.lessonComment.lesson.course.id,
          courseName: notification.lessonComment.lesson.course.name,
          lessonId: notification.lessonComment.lesson.id,
          lessonName: notification.lessonComment.lesson.name,
          userId: notification.lessonComment.createdByName.id,
          status:  notification.recipients.map((e) => e.statusCd)
        };
      }
    });

    return formattedNotifications;
  }

  async countNotification(userId: number): Promise<number> {
    const countStatusUnread = await this.recipientsRepository
      .createQueryBuilder('Recipients')
      .andWhere('Recipients.userId = :userId', { userId: userId })
      .andWhere('Recipients.statusCd = :status', { status: AppConstant.STATUS_NOTIFICATION_UNREAD })
      .getCount();

    return countStatusUnread;
  }

  async updateStatusNotification(id: Notifications['id'], userId: number): Promise<BaseResponseDto<Recipients>> {
    const recipient = await this.recipientsRepository.findOne({ where: { notificationId: id, userId: userId } });

    if (!recipient) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (recipient.statusCd === AppConstant.STATUS_NOTIFICATION_UNREAD) {
      await this.recipientsRepository.save({
        ...recipient,
        statusCd: AppConstant.STATUS_NOTIFICATION_READ,
      });
    }

    return ResponseHelper.success(recipient);
  }

  async updateAllStatusNotification(userId: number) {
    await this.recipientsRepository
      .createQueryBuilder()
      .update()
      .set({ statusCd: AppConstant.STATUS_NOTIFICATION_READ })
      .where('status_cd = :status_cd AND userId = :userId', {
        status_cd: AppConstant.STATUS_NOTIFICATION_UNREAD,
        userId: userId,
      })
      .execute();
  }

  async getNotificationYears(userId: number): Promise<number[]> {
    const query = this.notificationsRepository
      .createQueryBuilder('Notifications')
      .innerJoin('Notifications.recipients', 'recipients')
      .select('EXTRACT(YEAR FROM Notifications.created_at)', 'year')
      .where('recipients.userId = :userId', { userId: userId })
      .groupBy('year')
      .orderBy('year', 'DESC');

    const result = await query.getRawMany();
    return result.map((item) => item.year);
  }
}
