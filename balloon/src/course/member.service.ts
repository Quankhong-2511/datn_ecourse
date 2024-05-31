import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { MemberResponseType } from './types/member-response.type';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { Course } from './entities/course.entity';
import { AppConstant } from '../utils/app.constant';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(dto: CreateMemberDto): Promise<BaseResponseDto<MemberResponseType>> {
    const member = await this.memberRepository.save(this.memberRepository.create(dto));
    return ResponseHelper.success(member);
  }

  async findOne(fields: EntityCondition<Member>): Promise<BaseResponseDto<MemberResponseType>> {
    const member = await this.memberRepository.findOne({
      where: fields,
    });

    if (!member) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          id: fields.id,
        },
      );
    }

    return ResponseHelper.success(member);
  }

  async findOnly(fields: EntityCondition<Member>) {
    const member = await this.memberRepository.findOne({
      where: fields,
    });

    return ResponseHelper.success(member);
  }

  async update(id: Member['id'], payload: DeepPartial<Member>): Promise<BaseResponseDto<MemberResponseType>> {
    const member = await this.memberRepository.save(
      this.memberRepository.create({
        id,
        ...payload,
      }),
    );

    return ResponseHelper.success(member);
  }

  async getMembersPassByCourse(id: Course['id']): Promise<Member[]> {
    const query = this.memberRepository.createQueryBuilder();

    query.where('Member.course_id = :memberId', {
      memberId: id,
    });
    query.andWhere('Member.status = :status', { status: AppConstant.STATUS_MEMBER_PASS });
    query.innerJoinAndSelect('Member.user', 'user');

    const items = await query.getMany();

    return items;
  }

  async getMembersPendingByCourse(id: Course['id']): Promise<Member[]> {
    const query = this.memberRepository.createQueryBuilder();

    query.where('Member.course_id = :memberId', {
      memberId: id,
    });
    query.andWhere('Member.status = :status', { status: AppConstant.STATUS_MEMBER_PENDING });
    query.innerJoinAndSelect('Member.user', 'user');

    const items = await query.getMany();

    return items;
  }

  async getMembersByCourseDeleted(id: Course['id']): Promise<Member[]> {
    const query = this.memberRepository.createQueryBuilder();

    query.where('Member.course_id = :memberId', {
      memberId: id,
    });
    query.andWhere('Member.deleted_at IS NOT NULL');
    query.innerJoinAndSelect('Member.user', 'user');

    const items = await query.getMany();

    return items;
  }

  async softDelete(id: Course['id'], memberId: Member['id']): Promise<void> {
    await this.memberRepository.softDelete({
      courseId: id,
      userId: memberId,
    });
  }

  async isEmailInCourse(email: string, courseId: number) {
    return !!(await this.memberRepository.findOne({
      where: { user: { email }, courseId },
    }));
  }

  async isEmailInDeletedMembers(userId: number, courseId: number) {
    return await this.memberRepository
      .createQueryBuilder('member')
      .where('member.user_id = :userId', { userId })
      .andWhere('member.courseId = :courseId', { courseId: courseId })
      .withDeleted()
      .getOne();
  }

  async updateStatusMember(memberId: number, newStatus: number) {
    await this.memberRepository.update(memberId, { status: newStatus });
  }

  async getCourseByUserId(id: number) {
    const list = this.memberRepository.find({ where: { userId: id } });
    return list;
  }

  async getCourseByUserIdByRole(userId: number, role: number) {
    return this.memberRepository
      .createQueryBuilder('member')
      .where('member.user_id = :userId', { userId })
      .andWhere('member.role = :role', { role })
      .leftJoinAndSelect('member.course', 'course')
      .leftJoinAndSelect('course.user', 'teacher')
      .leftJoinAndSelect('member.user', 'user')
      .getMany();
  }
}
