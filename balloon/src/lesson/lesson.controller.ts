import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CommonService } from 'src/utils/services/common.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { FileEntity } from 'src/files/entities/file.entity';
import { getValueOrDefault, isNotEmptyField } from 'src/utils';
import { FilesService } from 'src/files/files.service';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonCommentDto } from './dto/create-lesson-comment.dto';
import { LessonCommentService } from './lesson-comment.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CourseService } from 'src/course/course.service';
import { LessonResponseType } from './types/lesson-response.type';
import { LessonCommentResponseType } from './types/lesson-comment-response.type';
import { ListPaginationLessonResponseType } from './types/list-pagination-lesson.type';
import { FilterLessonDto } from './dto/filter-lesson.dto';
import { ListLessonResponseType } from './types/list-lesson.type';
import { CommentGateway } from './comment.gateway';
import { CancelLessonDto } from './dto/cancel-lesson.dto';

@ApiTags('Lessons')
@Controller({
  path: 'lessons',
  version: '1',
})
@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonCommentService: LessonCommentService,
    private readonly courseService: CourseService,
    private readonly filesService: FilesService,
    private commonService: CommonService,
    private readonly commentGateway: CommentGateway,
  ) {}

  @Patch('updateStatus')
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async updateStatus(@Query('id') id: number, @Query('status') status: string, @Body()  dto: CancelLessonDto ) {
    return this.lessonService.updateStatus(id, status, dto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('')
  async create(@Body() dto: CreateLessonDto, @Req() request): Promise<BaseResponseDto<Lesson>> {
    const account = this.commonService.getAccountInformationLogin(request);
    await this.courseService.validateAdmin(account.id, dto.courseId);

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.filesService.findAllByPath(dto.file);
    }

    const lesson = await this.lessonService.create({
      ...dto,
      ...{ createdBy: account.id },
      ...{
        files: files.map((file) => {
          return {
            path: file.path,
            name: file.name,
          };
        }),
      },
    });

    return lesson;
  }

  @Get('')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'courseId', required: false, type: Number })
  findManyWithPagination(
    @Query() paginationDto: FilterLessonDto,
  ): Promise<BaseResponseDto<ListPaginationLessonResponseType>> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.lessonService.findManyWithPagination(paginationDto);
  }

  // @Get('')
  // async findAll(): Promise<BaseResponseDto<ListLessonResponseType>> {
  //   return this.lessonService.findAll();
  // }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() request): Promise<BaseResponseDto<LessonResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const lesson = await this.lessonService.findOne({ id });
    await this.courseService.validateMemberPass(account.id, getValueOrDefault(lesson.data?.courseId, 0));

    return lesson;
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body()
    dto: UpdateLessonDto,
    @Req() request,
  ): Promise<BaseResponseDto<LessonResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const lesson = await this.lessonService.findOne({ id });
    await this.courseService.validateAdmin(account.id, getValueOrDefault(lesson.data?.courseId, 0));

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.filesService.findAllByPath(dto.file);
    }

    const updateLesson = await this.lessonService.update(id, {
      ...dto,
      ...{
        files: files.map((file) => {
          return {
            path: file.path,
            name: file.name,
          };
        }),
      },
    });

    return updateLesson;
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async softDelete(@Param('id') id: number, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    const lesson = await this.lessonService.findOne({ id });
    await this.courseService.validateAdmin(account.id, getValueOrDefault(lesson.data?.courseId, 0));

    void this.lessonService.softDelete(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('comment')
  async createComment(
    @Body() dto: CreateLessonCommentDto,
    @Req() request,
  ): Promise<BaseResponseDto<LessonCommentResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const lesson = await this.lessonService.findOne({ id: dto.lessonId });
    await this.courseService.validateMemberPass(account.id, getValueOrDefault(lesson.data?.courseId, 0));

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.filesService.findAllByPath(dto.file);
    }

    const newComment = await this.lessonCommentService.create({
      ...dto,
      ...{ createdBy: account.id },
      ...{
        files: files.map((file) => {
          return {
            path: file.path,
            name: file.name,
          };
        }),
      },
    });

    this.commentGateway.notifyNewComment(newComment);

    return {
      message: 'Comment created successfully',
      data: newComment,
    };
  }

  @Post('countComment')
  @ApiQuery({ name: 'courseId', required: false, type: Number })
  async getCountComment(@Query('courseId') courseId: number, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    return this.lessonService.countComment(courseId, account.id);
  }
}
