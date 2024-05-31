import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { Invite } from './entities/invite.entity';
import { InviteResponseType } from './types/invite-response.type';
import { UsersService } from 'src/users/users.service';
import { MemberService } from './member.service';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { Commission } from './entities/commission.entity';
import { formatDate } from 'src/utils';
import { randomBytes } from 'crypto';
import { AppConstant } from 'src/utils/app.constant';

Injectable();
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
    private usersService: UsersService,
    private memberService: MemberService,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
  ) {}
  async create(inviteMember: DeepPartial<Invite>): Promise<BaseResponseDto<InviteResponseType>> {
    const invitationMember = await this.inviteRepository.save(this.inviteRepository.create(inviteMember));
    return ResponseHelper.success(invitationMember);
  }

  async findOne(fields: EntityCondition<Invite>): Promise<Invite | null> {
    return await this.inviteRepository.findOne({
      where: fields,
    });
  }
  async getOne(id: number, courseId: number): Promise<Invite> {
    const data = await this.inviteRepository.findOne({
      where: {sender: id, courseId: courseId},
    });

    if(!data) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.NOT_FOUND
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }

    return data
  }

  async saveUserBuyCourseWithLink(userId: number, uuid: string) {
    await this.inviteRepository
      .createQueryBuilder('invite')
      .update()
      .set({ userId: userId })
      .where('invite.uuid = :uuid', { uuid })
      .execute();
  }

  async getUsersByLevel(senderId: number, courseId: number, currentLevel: number = 1): Promise<any[]> {
    if (currentLevel > 5) return [];

    const listUserByCourse = await this.inviteRepository
      .createQueryBuilder('invite')
      .select(['invite.userId', 'invite.createdAt'])
      .where('invite.sender = :userId', { userId: senderId })
      .andWhere('invite.courseId = :courseId', { courseId: courseId })
      .getMany();

    const result: any = [];

    for (const user of listUserByCourse) {
      const children = await this.getUsersByLevel(user.userId, courseId, currentLevel + 1);
      result.push({
        user: await this.usersService.getNameUser(user.userId),
        level: currentLevel,
        commission: await this.calculateCommissionForUser(senderId, currentLevel, courseId),
        children,
        createdAt: formatDate(user.createdAt),
      });
    }

    return result;
  }

  async getUserWithLvByCourse(userId: number): Promise<any[]> {
    const listCourse = await this.inviteRepository.find({ where: { sender: userId } });
    const uniqueCourse = Array.from(
      new Set(
        listCourse.map((e) => JSON.stringify({ courseId: e.courseId, courseName: e.courseName, price: e.price })),
      ),
    ).map((e) => JSON.parse(e));

    const result: any = [];

    for (const course of uniqueCourse) {
      const children = await this.getUsersByLevel(userId, course.courseId);
      result.push({
        course: course.courseId,
        price: course?.price,
        title: course?.courseName,
        children,
      });
    }

    return result;
  }

  async calculateCommissionForUser(userId: number, level: number, courseId: number): Promise<number> {
    const dataInvite = await this.inviteRepository.findOne({ where: { sender: userId, courseId: courseId } });
    const commission = await this.commissionRepository.findOne({ where: { id: 1 } });
    if (!dataInvite || !commission) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let percentage = 0;

    if (level === 1) {
      percentage = commission.level_1 / 100; // 30%
    } else if (level === 2) {
      percentage = commission.level_2 / 100; // 10%
    } else if (level === 3) {
      percentage = commission.level_3 / 100; // 5%
    } else if (level === 4) {
      percentage = commission.level_4 / 100; // 3%
    } else if (level === 5) {
      percentage = commission.level_5 / 100; // 2%
    }

    return dataInvite.price * percentage;
  }

  async getNameCourse(id: number) {
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.name')
      .where('course.id = :id', { id: id })
      .getOne();

    console.log(course?.name);

    return course ? { name: course.name } : null;
  }

  private async generateUniqueUUID(length: number): Promise<string> {
    let uuid: string;
    let exists: boolean;

    do {
      uuid = randomBytes(length).toString('hex').slice(0, length);
      exists = (await this.findOne({ uuid })) !== null;
    } while (exists);

    return uuid;
  }

  async findSenderAdmin(courseId: number, userId: number) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    const rs = await this.inviteRepository.findOne({ where: { sender: 1, courseId: courseId } });

    if (!rs) {
      const newDataInvite = {
        uuid: await this.generateUniqueUUID(16),
        userId,
        courseName: course?.name,
        courseId: courseId,
        role: AppConstant.ROLE_MEMBER,
        sender: 1,
        price: course?.lastPrice,
      };
      await this.create(newDataInvite);
    } else {
      if (!rs?.userId) {
        await this.saveUserBuyCourseWithLink(userId, rs.uuid);
      } else {
        const newDataInvite = {
          uuid: rs.uuid,
          userId,
          courseName: course?.name,
          courseId: courseId,
          role: AppConstant.ROLE_MEMBER,
          sender: 1,
          price: course?.lastPrice,
        };
        await this.create(newDataInvite);
      }
    }
    return rs;
  }
}
