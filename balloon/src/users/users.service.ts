import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { CommonService } from 'src/utils/services/common.service';
import { AuthRegisterLoginDto } from 'src/auth/dto/auth-register-login.dto';
import { EmailExistsDto } from 'src/auth/dto/email-exists.dto';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Course } from 'src/course/entities/course.entity';
import { Member } from 'src/course/entities/member.entity';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { AppConstant } from 'src/utils/app.constant';
import { getValueOrDefault } from '../utils/index';
import { changePasswordCustomDto } from 'src/auth/dto/change-password-custom.dto';
import bcrypt from 'bcryptjs';
import { changePasswordDto } from 'src/auth/dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private commonService: CommonService,
  ) {}

  create(createProfileDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(this.usersRepository.create(createProfileDto));
  }

  async findManyWithPagination(paginationOptions: IPaginationOptions): Promise<User[]> {
    const users = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return users;
  }

  async updateAllTuitionFees(): Promise<void> {
    const users = await this.usersRepository.find();

    await Promise.all(users.map((user) => this.calculateTuitionFees(user.id)));
  }

  findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    const user = this.usersRepository.findOne({
      where: fields,
    });

    if (!user) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.USER_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  async findOneCalculate(id: number): Promise<NullableType<User>> {
    await this.calculateTuitionFees(id);
    const user = await this.usersRepository.findOne({ where: { id: id }, relations: ['members.course'] });

    return user;
  }

  update(id: User['id'], payload: DeepPartial<User>): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async updateTeacher(userId: number) {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ teacher: true })
      .where('id = :id', { id: userId })
      .execute();
  }

  async editAccount(id: User['id'], dto: UpdateUserDto): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...dto,
      }),
    );
  }

  async checkEmailMemberExists(emailExistsDto: EmailExistsDto): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        email: emailExistsDto.email,
      },
    });
  }

  async registerNotOtp(dto: AuthRegisterLoginDto): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({
        ...dto,
        email: dto.email,
        role: {
          id: RoleEnum.user,
        },
        status: {
          id: StatusEnum.inactive,
        },
      }),
    );
  }

  async updateStatusUser(userId: number, newStatus: StatusEnum) {
    await this.usersRepository.update(userId, { status: { id: newStatus } });
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async calculateTuitionFees(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['members'] });
    if (!user) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.USER_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let totalFee = 0;
    let totalReduce = 0;

    for (const member of user.members) {
      if (member.role !== AppConstant.ROLE_ADMIN) {
        totalFee += member.price;
        totalReduce += Number(member.reduced);
      }
    }

    user.tuitionFees = totalFee - totalReduce;
    await this.usersRepository.save(user);
  }

  async updateCommission(userId: number, courseId: number) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });

    if (!course) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.COURSE_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const coursePrice = course.lastPrice;
    const commissionValue = coursePrice * 0.1;

    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.USER_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.commission += commissionValue;
    await this.usersRepository.save(user);
  }

  async checkAvailableBalances(userId: number, price: number) {
    const user = await this.findOne({ id: userId });
    if (user && user?.availableBalances < price) {
      return false;
    }
    return true;
  }

  async calculatorWhenBuyCourse(userId: number, price: number) {
    const user = await this.findOne({ id: userId });

    if (user) {
      user.availableBalances = user.availableBalances - price;
      await this.usersRepository.save(user);
    }

    return user;
  }

  async changePasswordCustom(changePassword: changePasswordCustomDto, id: number): Promise<string> {
    if (changePassword.password === changePassword.rePassword) {
      const user = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (user) {
        const isValidPassword = await bcrypt.compare(changePassword.oldPassword, user.password);

        if (!isValidPassword) {
          throw new HttpException(
            {
              status: 4001,
              error: 'Sai mật khẩu',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.usersRepository.save(
          this.usersRepository.create({
            id,
            password: changePassword.password,
          }),
        );
      }

      return 'Đổi mật khẩu thành công';
    } else {
      throw new BadRequestException('Mật khẩu không giống nhau');
    }
  }

  async resetPassWord(changePassword: changePasswordDto, id: number): Promise<string> {
    if (changePassword.password === changePassword.rePassword) {
      const user = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (user) {
        await this.usersRepository.save(
          this.usersRepository.create({
            id,
            password: changePassword.password,
          }),
        );
      }

      return 'Change password success';
    } else {
      throw new BadRequestException('passwords are not the same');
    }
  }

  async findAllUser() {
    return this.usersRepository
      .createQueryBuilder('user')
      .select()
      .where('user.role.id = :roleId', { roleId: 2 })
      .orderBy('user.id', 'ASC')
      .getMany();
  }

  async getNameUser(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.name', 'user.email'])
      .where('user.id = :id', { id: id })
      .getOne();

    return user ? { id: id, name: user.name, email: user.email } : null;
  }
}
