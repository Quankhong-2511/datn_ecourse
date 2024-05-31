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
import { PostService } from './post.service';
import { FilesService } from 'src/files/files.service';
import { CommonService } from 'src/utils/services/common.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CourseService } from 'src/course/course.service';
import { FileEntity } from 'src/files/entities/file.entity';
import { isNotEmptyField } from 'src/utils';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { PostResponseType } from './types/post-response.type';
import { UpdatePostDto } from './dto/update-post.dto';
import { getValueOrDefault } from '../utils/index';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { PostCommentResponseType } from './types/post-comment-response.type';
import { PostCommentService } from './post-comment.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { ListPaginationPostResponseType } from './types/list-pagination-post.type';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postCommentService: PostCommentService,
    private readonly fileService: FilesService,
    private readonly courseService: CourseService,
    private commonService: CommonService,
  ) {}

  @Post('')
  async create(@Body() dto: CreatePostDto, @Req() request): Promise<BaseResponseDto<PostResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    await this.courseService.validateAdmin(account.id, dto.courseId);

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.fileService.findAllByPath(dto.file);
    }

    const post = await this.postService.create({
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

    return post;
  }

  @Get('')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'courseId', required: false, type: Number })
  findManyWithPagination(
    @Query() paginationDto: FilterPostDto,
  ): Promise<BaseResponseDto<ListPaginationPostResponseType>> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.postService.findManyWithPagination(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BaseResponseDto<PostResponseType>> {
    return this.postService.findOne({ id });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    dto: UpdatePostDto,
    @Req() request,
  ): Promise<BaseResponseDto<PostResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const post = await this.postService.findOne({ id });
    await this.courseService.validateAdmin(account.id, getValueOrDefault(post.data?.courseId, 0));

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.fileService.findAllByPath(dto.file);
    }

    return this.postService.update(id, {
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
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    const post = await this.postService.findOne({ id });
    await this.courseService.validateAdmin(account.id, getValueOrDefault(post.data?.courseId, 0));

    void this.postService.softDelete(id);
  }

  @Post('comment')
  async createComment(
    @Body() dto: CreatePostCommentDto,
    @Req() request,
  ): Promise<BaseResponseDto<PostCommentResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const post = await this.postService.findOne({ id: dto.postId });
    await this.courseService.validateMemberPass(account.id, getValueOrDefault(post.data?.courseId, 0));

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.fileService.findAllByPath(dto.file);
    }

    return this.postCommentService.create({
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
  }
}
