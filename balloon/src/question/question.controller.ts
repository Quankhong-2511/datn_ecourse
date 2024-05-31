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
import { QuestionService } from './question.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { QuestionCommentService } from './question-comment.service';
import { FilesService } from 'src/files/files.service';
import { CourseService } from 'src/course/course.service';
import { CommonService } from 'src/utils/services/common.service';
import { QuestionResponseType } from './types/question-response.type';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateQuestionCommentDto } from './dto/create-question-comment.dto';
import { QuestionCommentResponseType } from './types/question-comment-response.type';
import { FileEntity } from 'src/files/entities/file.entity';
import { isNotEmptyField, getValueOrDefault } from 'src/utils';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FilterQuestionDto } from './dto/filter-question.dto';
import { ListPaginationQuestionResponseType } from './types/list-pagination-question.type';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Questions')
@Controller({
  path: 'questions',
  version: '1',
})
@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly questionCommentService: QuestionCommentService,
    private readonly fileService: FilesService,
    private readonly courseService: CourseService,
    private commonService: CommonService,
  ) {}

  @Post('')
  async create(@Body() dto: CreateQuestionDto, @Req() request): Promise<BaseResponseDto<QuestionResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    await this.courseService.validateAdmin(account.id, dto.courseId);

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.fileService.findAllByPath(dto.file);
    }

    const question = await this.questionService.create({
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

    return question;
  }

  @Get('')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'courseId', required: false, type: Number })
  findManyWithPagination(
    @Query() paginationDto: FilterQuestionDto,
  ): Promise<BaseResponseDto<ListPaginationQuestionResponseType>> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.questionService.findManyWithPagination(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BaseResponseDto<QuestionResponseType>> {
    return this.questionService.findOne({ id });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    dto: UpdateQuestionDto,
    @Req() request,
  ): Promise<BaseResponseDto<QuestionResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const question = await this.questionService.findOne({ id });
    await this.courseService.validateAdmin(account.id, getValueOrDefault(question.data?.courseId, 0));

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.fileService.findAllByPath(dto.file);
    }

    return this.questionService.update(id, {
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
    const question = await this.questionService.findOne({ id });
    await this.courseService.validateAdmin(account.id, getValueOrDefault(question.data?.courseId, 0));

    void this.questionService.softDelete(id);
  }

  @Post('comment')
  async createComment(
    @Body() dto: CreateQuestionCommentDto,
    @Req() request,
  ): Promise<BaseResponseDto<QuestionCommentResponseType>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const question = await this.questionService.findOne({ id: dto.quesitonId });
    await this.courseService.validateMemberPass(account.id, getValueOrDefault(question.data?.courseId, 0));

    let files: FileEntity[] = [];
    if (isNotEmptyField(dto.file)) {
      files = await this.fileService.findAllByPath(dto.file);
    }

    return this.questionCommentService.create({
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
