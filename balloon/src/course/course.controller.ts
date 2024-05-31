import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { MemberService } from './member.service';
import { CommonService } from 'src/utils/services/common.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { AppConstant } from 'src/utils/app.constant';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { CourseResponseType } from './types/course-response.type';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { FilterCourseDto } from './dto/filter-course.dto';
import { Member } from './entities/member.entity';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberResponseType } from './types/member-response.type';
import { ListResponseType } from './types/list-response.type';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { BuyCourseWithLinkDto } from './dto/active-member.dto';
import { Invite } from './entities/invite.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { getValueOrDefault, isNotEmptyField } from '../utils/index';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { UsersService } from 'src/users/users.service';
import { BuyCourseDto } from './dto/buy-course.dto';
import { FilesService } from 'src/files/files.service';
import { FileEntity } from 'src/files/entities/file.entity';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InviteService } from './invite.service';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@ApiTags('Courses')
@Controller({
  path: 'courses',
  version: '1',
})
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly memberService: MemberService,
    private readonly inviteService: InviteService,
    private readonly usersService: UsersService,
    private commonService: CommonService,
    private readonly filesService: FilesService,
  ) {}

  @Get('category')
  findAllCategory() {
    return this.courseService.findAllCategory();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('commission')
  getCommission() {
    return this.courseService.getCommission();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('commission/update')
  updateCommission(@Body() dto: UpdateCommissionDto) {
    return this.courseService.updateCommission(dto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('level')
  getUserWithLvByCourse(@Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    return this.inviteService.getUserWithLvByCourse(account.id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('level/:userId')
  adminGetUserWithLvByCourse(@Param('userId') userId: number) {
    return this.inviteService.getUserWithLvByCourse(userId);
  }

  @Get('revenue')
  async getAllRevenue() {
    return this.courseService.countRevenueAll();
  }

  @Patch('updateStatus')
  @ApiQuery({ name: 'id', required: false, type: Number })
  async updateStatus(@Query('id') id: number) {
    return this.courseService.updateStatus(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiQuery({ name: 'role', required: false, type: Number })
  @Get('user')
  async getCourseByUser(@Query('role') role: number, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);

    return this.memberService.getCourseByUserIdByRole(account.id, role);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('')
  async create(@Body() dto: CreateCourseDto, @Req() request): Promise<BaseResponseDto<CourseResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const user = await this.usersService.findOne({ id: account.id });

    if (user?.teacher === true) {
      let files: FileEntity[] = [];
      if (isNotEmptyField(dto.file)) {
        files = await this.filesService.findAllByPath(dto.file);
      }

      const courseCreate = await this.courseService.create({
        ...dto,
        ...{ createdBy: account.id, teacher: account.id },
        ...{
          files: files.map((file) => {
            return {
              path: file.path,
              name: file.name,
            };
          }),
        },
      });

      if (courseCreate.data) {
        await this.memberService.create({
          ...{
            courseId: courseCreate.data.id,
            role: AppConstant.ROLE_ADMIN,
            status: AppConstant.STATUS_MEMBER_PASS,
            teacher: account.id,
          },
          ...{ userId: account.id },
        });
      }

      return courseCreate;
    }

    throw new ApiException(
      {
        id: ErrorCodeEnum.USER_ARE_NOT_TEACHER,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  // @ApiBearerAuth()F
  // @Roles(RoleEnum.admin, RoleEnum.user)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BaseResponseDto<CourseResponseType>> {
    return this.courseService.findOne({ id });
  }

  // @ApiBearerAuth()
  // @Roles(RoleEnum.admin, RoleEnum.user)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'statusLesson', required: false, type: String })
  findManyWithPagination(@Query() paginationDto: FilterCourseDto): Promise<BaseResponseDto<ListResponseType>> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.courseService.findManyWithPagination(paginationDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id/members')
  async getMemberByCourse(@Param('id') id: number, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    // await this.courseService.validateMemberPass(account.id, id);

    const allMemberPassWithAdmin = await this.memberService.getMembersPassByCourse(id);
    let admin: Member | null = null;
    const members = allMemberPassWithAdmin.filter((member) => {
      if (member.role === AppConstant.ROLE_ADMIN) {
        admin = member;
      }

      return member.role !== AppConstant.ROLE_ADMIN;
    });

    return ResponseHelper.success({
      admin,
      members,
      // membersPending: allMemberPending,
      // membersDeleted: allMemberDeleted,
    });
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':id/member')
  async createMember(
    @Param('id') id: number,
    @Body() dto: CreateMemberDto,
    @Req() request,
  ): Promise<BaseResponseDto<MemberResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    await this.courseService.validateAdmin(account.id, id);

    const member = await this.memberService.create(dto);
    return member;
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/member/:memberId')
  async updateMember(
    @Param('id') id: number,
    @Param('memberId') memberId: number,
    @Body() dto: UpdateMemberDto,
    @Req() request,
  ): Promise<BaseResponseDto<MemberResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    await this.courseService.validateAdmin(account.id, id);

    const member = await this.memberService.update(memberId, dto);
    return member;
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateCourseDto, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    // await this.courseService.validateAdmin(account.id, id);

    // let files: FileEntity[] = [];
    // if (isNotEmptyField(dto.file)) {
    //   files = await this.filesService.findAllByPath(dto.file);
    // }

    return await this.courseService.update(
      id,
      dto,
      // ...{
      //   files: files.map((file) => {
      //     return {
      //       path: file.path,
      //       name: file.name,
      //     };
      //   }),
      // },
    );
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async softDelete(@Param('id') id: number, @Req() request): Promise<void> {
    const account = this.commonService.getAccountInformationLogin(request);
    await this.courseService.validateAdmin(account.id, id);

    void this.courseService.softDelete(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':id/invite')
  async invite(@Param('id') id: number, @Body() dto: InviteMemberDto, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    await this.courseService.validateMemberPass(account.id, id);
    return await this.courseService.inviteMember(dto, id, account.id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':id/createLink')
  async createLink(@Param('id') id: number, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);

    return await this.courseService.createLinkShare(account.id, id);
  }

  @Post('readInfoInvite')
  async getInfoInvite(@Body() dto: BuyCourseWithLinkDto): Promise<BaseResponseDto<Readonly<Invite>>> {
    return await this.courseService.readUuidInvite(dto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('buyCourseWithLink')
  async buyCourseWithLink(@Body() dto: BuyCourseWithLinkDto, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);

    return await this.courseService.buyCourseWithLink(dto, account.id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('buyCourse')
  async buyCourse(@Body() buyCourseDto: BuyCourseDto, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    const member = await this.memberService.findOnly({
      courseId: buyCourseDto.courseId,
      userId: account.id,
    });

    if (member.data === null) {
      return this.courseService.buyCourse(account.id, buyCourseDto);
    } else {
      throw new ApiException(
        {
          id: ErrorCodeEnum.MEMBER_IS_EXISTS,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
