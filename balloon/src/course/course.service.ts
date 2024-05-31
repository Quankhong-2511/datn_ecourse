import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { FilterCourseDto } from './dto/filter-course.dto';
import { CommonService } from 'src/utils/services/common.service';
import { ListResponseType } from './types/list-response.type';
import { getValueOrDefault, isAdmin, isNotEmptyField } from 'src/utils';
import { MemberService } from './member.service';
import { UsersService } from 'src/users/users.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { InviteService } from './invite.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AppConstant } from 'src/utils/app.constant';
import { BuyCourseWithLinkDto } from './dto/active-member.dto';
import { Invite } from './entities/invite.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { BuyCourseDto } from './dto/buy-course.dto';
import { Member } from './entities/member.entity';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Commission } from './entities/commission.entity';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
    private memberService: MemberService,
    private usersService: UsersService,
    private inviteService: InviteService,
    private mailService: MailService,
    private authService: AuthService,
    private commonService: CommonService,
    private configService: ConfigService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<BaseResponseDto<Course>> {
    if (createCourseDto.categoryName !== undefined) {
      const createCategoryDto: CreateCategoryDto = {
        title: createCourseDto.categoryName,
      };

      const newCategory = await this.createCategory(createCategoryDto);
      createCourseDto.category = newCategory.id;
    }

    const course = await this.courseRepository.save(this.courseRepository.create(createCourseDto));
    return ResponseHelper.success(course);
  }

  async findOne(fields: EntityCondition<Course>): Promise<BaseResponseDto<Course>> {
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.user', 'user')
      .leftJoinAndSelect('course.categoryInfo', 'categoryInfo')
      .where(fields)
      .getOne();

    if (!course) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.COURSE_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          id: fields.id,
        },
      );
    }

    course.revenue = await this.countRevenue(course.id);

    return ResponseHelper.success(course);
  }

  async findManyWithPagination(paginationDto: FilterCourseDto): Promise<BaseResponseDto<ListResponseType>> {
    const query = this.courseRepository.createQueryBuilder();

    if (paginationDto.keyword) {
      query.where('LOWER(Course.name) LIKE :keyword', {
        keyword: `%${paginationDto.keyword.toString().toLowerCase()}%`,
      });
    }

    if (paginationDto.id) {
      query.andWhere('Course.id = :id', {
        id: paginationDto.id,
      });
    }

    if (paginationDto.categoryId) {
      query.andWhere('Course.category = :category', {
        category: paginationDto.categoryId,
      });
    }

    if (paginationDto.userId) {
      query.leftJoinAndSelect('Course.members', 'members');
      query.andWhere('members.userId = :userId', { userId: paginationDto.userId });
    }

    if (paginationDto.statusLesson) {
      query.leftJoinAndSelect('Course.lesson', 'lesson');
      query.andWhere('lesson.status = :status', { status: paginationDto.statusLesson });
    }

    query.leftJoinAndSelect('Course.user', 'user');
    query.leftJoinAndSelect('Course.categoryInfo', 'categoryInfo');
    query.orderBy('Course.createdAt', 'DESC');

    const list = this.commonService.getDataByPagination(paginationDto, query);

    return list;
  }

  async update(id: Course['id'], payload: UpdateCourseDto): Promise<BaseResponseDto<Course>> {
    const course = await this.courseRepository.save(
      this.courseRepository.create({
        id,
        ...payload,
      }),
    );

    return ResponseHelper.success(course);
  }

  async softDelete(id: Course['id']): Promise<void> {
    void this.courseRepository.softDelete(id);
  }

  async inviteMember(inviteMemberDto: InviteMemberDto, courseId: number, sender: number): Promise<void> {
    const isEmailInCourse = await this.memberService.isEmailInCourse(inviteMemberDto.email, courseId);

    if (isEmailInCourse) {
      throw new ApiException(
        {
          message: ErrorCodeEnum.MEMBER_IS_EXISTS,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const course = await this.courseRepository.findOne({ where: { id: courseId } });

    if (course?.name) {
      const idInvite = await this.inviteService.findOne({ courseId: courseId, sender: sender });
      if (!idInvite) {
        const dataInvite = {
          courseName: course?.name,
          courseId: courseId,
          email: inviteMemberDto.email,
          role: inviteMemberDto.role,
          name: inviteMemberDto.name,
          sender: sender,
          price: course.lastPrice,
          phone: inviteMemberDto.phone,
        };

        await this.inviteService.create(dataInvite);
        const memberInvite = await this.inviteService.findOne({ courseId: courseId, sender: sender });

        await this.mailService.inviteEmail({
          to: inviteMemberDto.email,
          data: {
            hash: `http://localhost:3000/course/intro/${courseId}?senderId=${sender}&uuid=${memberInvite?.id}`,
            userName: dataInvite.name,
            courseName: dataInvite.courseName,
            price: dataInvite.price,
          },
        });

        console.log(
          'Đuôi URL mời',
          `http://localhost:3000/course/intro/${courseId}?senderId=${sender}&uuid=${memberInvite?.uuid}`,
        );
      } else {
        await this.mailService.inviteEmail({
          to: inviteMemberDto.email,
          data: {
            hash: `http://localhost:3000/course/intro/${courseId}?senderId=${sender}&uuid=${idInvite?.uuid}`,
            userName: idInvite.name,
            courseName: idInvite.courseName,
            price: idInvite.price,
          },
        });
        console.log(
          'Đuôi URL mời',
          `http://localhost:3000/course/intro/${courseId}?senderId=${sender}&uuid=${idInvite?.uuid}`,
        );
      }
    }
  }

  private async generateUniqueUUID(length: number): Promise<string> {
    let uuid: string;
    let exists: boolean;

    do {
      uuid = randomBytes(length).toString('hex').slice(0, length);
      exists = (await this.inviteService.findOne({ uuid })) !== null;
    } while (exists);

    return uuid;
  }

  async createLinkShare(userId: number, courseId: number) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (course) {
      const idInvite = await this.inviteService.findOne({ courseId: courseId, sender: userId });
      if (!idInvite) {
        const dataInvite = {
          uuid: await this.generateUniqueUUID(16),
          courseName: course?.name,
          courseId: courseId,
          role: AppConstant.ROLE_MEMBER,
          sender: userId,
          price: course.lastPrice,
        };

        await this.inviteService.create(dataInvite);
        const newDataInvite = await this.inviteService.findOne({ courseId: courseId, sender: userId });

        const url = `http://localhost:3000/course/intro/${courseId}?senderId=${userId}&uuid=${newDataInvite?.uuid}`;

        return url;
      } else {
        const url = `http://localhost:3000/course/intro/${courseId}?senderId=${userId}&uuid=${idInvite?.uuid}`;
        return url;
      }
    }
  }

  async readUuidInvite(dto: BuyCourseWithLinkDto): Promise<BaseResponseDto<Invite>> {
    const uuidInvite = await this.inviteService.findOne({ uuid: dto.uuid });
    if (!uuidInvite) {
      throw new ApiException(
        {
          message: ErrorCodeEnum.TOKEN_NOT_EXISTS,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return ResponseHelper.success(uuidInvite);
  }

  async buyCourseWithLink(dto: BuyCourseWithLinkDto, userId: number) {
    const dataInvite = await this.inviteService.findOne({ uuid: dto.uuid });
    if (!dataInvite) {
      throw new ApiException(
        {
          message: ErrorCodeEnum.TOKEN_NOT_EXISTS,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!dataInvite.userId) {
      await this.inviteService.saveUserBuyCourseWithLink(userId, dto.uuid);
    } else {
      const newDataInvite = {
        uuid: dataInvite.uuid,
        courseName: dataInvite?.courseName,
        userId: userId,
        courseId: dataInvite?.courseId,
        role: AppConstant.ROLE_MEMBER,
        sender: dataInvite.sender,
        price: dataInvite.price,
      };

      await this.inviteService.create(newDataInvite);
    }

    const sender = await this.usersService.findOne({ id: dataInvite.sender });
    const course = await this.findOne({ id: dataInvite.courseId });

    if (!sender) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.USER_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let createMemberDto: CreateMemberDto = {
      courseId: dataInvite.courseId,
      userId: userId,
      role: dataInvite.role,
      status: AppConstant.STATUS_MEMBER_PASS,
      reduced: getValueOrDefault(course.data?.lastPrice, 0) * 0.1,
      price: course.data?.lastPrice,
    };

    await this.memberService.create(createMemberDto);
    await this.usersService.calculateTuitionFees(userId);

    void this.mailService.inviteUserSuccessfully({
      to: sender.email ?? '',
      data: {
        sender: sender.name ?? '',
        userName: dataInvite.name,
        courseName: dataInvite.courseName,
        commission: dataInvite.commission,
      },
    });

    return true;
  }

  async buyCourse(userId: number, buyCourseDto: BuyCourseDto) {
    const userBuyCourse = await this.usersService.findOne({ id: userId });
    const course = await this.findOne({ id: buyCourseDto.courseId });
    const teacher = await this.usersService.findOne({ id: course.data?.teacher });

    if (!course || !userBuyCourse || !teacher) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let createMemberDto: CreateMemberDto = {
      courseId: buyCourseDto.courseId,
      userId: userId,
      role: AppConstant.ROLE_MEMBER,
      status: AppConstant.STATUS_MEMBER_PASS,
      reduced: 0,
      price: course.data?.lastPrice,
    };

    await this.memberService.create(createMemberDto);
    await this.inviteService.findSenderAdmin(buyCourseDto.courseId, userId);
    await this.usersService.calculateTuitionFees(userId);
  }

  validateUserAndCourseIdNotNull(userId: number, courseId: number) {
    if (!isNotEmptyField(userId, true) || !isNotEmptyField(courseId, true)) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_PERMISSION,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  validateCreatedBy(userId: number, createdBy: number): void {
    if (userId !== createdBy) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_PERMISSION,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateMemberPass(userId: number, courseId: number): Promise<void> {
    this.validateUserAndCourseIdNotNull(userId, courseId);

    const member = await this.memberService.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!member || member.data?.status !== AppConstant.STATUS_MEMBER_PASS) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_PERMISSION,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateMember(userId: number, courseId: number): Promise<void> {
    this.validateUserAndCourseIdNotNull(userId, courseId);

    const member = await this.memberService.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!member) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_PERMISSION,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateAdmin(userId: number, courseId: number): Promise<void> {
    this.validateUserAndCourseIdNotNull(userId, courseId);

    const member = await this.memberService.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!isAdmin(member?.data?.role)) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_PERMISSION,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateRoleAdminOrCreatedBy(userId: number, courseId: number, createdBy: number): Promise<boolean> {
    this.validateUserAndCourseIdNotNull(userId, courseId);

    const member = await this.memberService.findOne({
      courseId: courseId,
      userId: userId,
    });

    const admin = isAdmin(member?.data?.role);

    if (admin || userId === createdBy) {
      return true;
    } else {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_NOT_PERMISSION,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save(this.categoryRepository.create(createCategoryDto));
  }

  async findAllCategory() {
    const category = await this.categoryRepository.createQueryBuilder().getMany();
    return category;
  }

  async getCourseByUser(id: number) {
    const list = this.courseRepository
      .createQueryBuilder()
      .innerJoinAndSelect('Course.members', 'members')
      .where('members.id := userId', { userId: id });
    return list;
  }

  async countRevenue(id: number) {
    const listMember = await this.memberService.getMembersPassByCourse(id);

    const revenue = listMember.reduce((acc, member) => {
      return acc + (member.price - member.reduced || 0);
    }, 0);

    await this.courseRepository
      .createQueryBuilder('course')
      .update(Course)
      .set({ revenue: revenue })
      .where('id = :id', { id })
      .execute();

    return revenue;
  }

  async countRevenueAll() {
    const listCourse = await this.courseRepository.find();

    for (const course of listCourse) {
      const listMember = await this.memberService.getMembersPassByCourse(course.id);

      const revenue = listMember.reduce((acc, member) => {
        return acc + (member.price - member.reduced || 0);
      }, 0);

      await this.courseRepository
        .createQueryBuilder('course')
        .update(Course)
        .set({ revenue: revenue })
        .where('id = :id', { id: course.id })
        .execute();
    }
  }

  async updateStatus(id: number) {
    await this.courseRepository
      .createQueryBuilder('lesson')
      .update(Course)
      .set({ status: 'Đã duyệt' })
      .where('id = :id', { id })
      .execute();
  }

  async getCommission() {
    return this.commissionRepository.findOne({ where: { id: 1 } });
  }

  async updateCommission(dto: UpdateCommissionDto) {
    const existingCommission = await this.commissionRepository.findOne({ where: { id: 1 } });

    if (!existingCommission) {
      throw new Error('Commission with id 1 not found');
    }

    const updatedDto = { ...dto, id: 1 };

    return this.commissionRepository.save(updatedDto);
  }
}
