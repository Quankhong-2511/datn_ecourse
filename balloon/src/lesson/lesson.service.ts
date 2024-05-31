import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponseType } from './types/lesson-response.type';
import { AppConstant } from 'src/utils/app.constant';
import { FilterLessonDto } from './dto/filter-lesson.dto';
import { ListPaginationLessonResponseType } from './types/list-pagination-lesson.type';
import { CommonService } from 'src/utils/services/common.service';
import { LessonComment } from './entities/lesson-comment.entity';
import { ListLessonResponseType } from './types/list-lesson.type';
import { CancelLessonDto } from './dto/cancel-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonComment)
    private lessonCommentRepository: Repository<LessonComment>,
    private commonService: CommonService,
  ) {}

  async create(dto: CreateLessonDto): Promise<BaseResponseDto<Lesson>> {
    const lesson = await this.lessonRepository.save(this.lessonRepository.create(dto));
    return ResponseHelper.success(lesson);
  }

  async findManyWithPagination(
    paginationDto: FilterLessonDto,
  ): Promise<BaseResponseDto<ListPaginationLessonResponseType>> {
    const query = this.lessonRepository.createQueryBuilder();

    if (paginationDto.keyword) {
      query.where('(LOWER(Lesson.content) LIKE :keyword OR LOWER(Lesson.name) LIKE :keyword)', {
        keyword: `%${paginationDto.keyword.toString().toLowerCase()}%`,
      });
    }

    if (paginationDto.id) {
      query.andWhere('Lesson.id = :id', {
        id: paginationDto.id,
      });
    }

    if (paginationDto.courseId) {
      const queryCondition = this.commonService.createQueryMultipleValue(paginationDto.courseId, 'Lesson', 'course_id');

      if (queryCondition.queryString && queryCondition.parameters) {
        query.andWhere(queryCondition.queryString, queryCondition.parameters);
      }
    }

    query.leftJoinAndSelect('Lesson.commentsTop', 'comment');
    query.orderBy('Lesson.id', 'DESC');
    query.addOrderBy('comment.createdAt', 'DESC');

    return this.commonService.getDataByPagination(paginationDto, query);
  }

  async findAll(): Promise<BaseResponseDto<ListLessonResponseType>> {
    const data = await this.lessonRepository.find();
    return ResponseHelper.success(data);
  }

  async findOne(fields: EntityCondition<Lesson>): Promise<BaseResponseDto<LessonResponseType>> {
    const lesson = await this.lessonRepository.findOne({
      where: fields,
    });

    if (!lesson) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.LESSON_NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          id: fields,
        },
      );
    }

    return ResponseHelper.success(lesson);
  }

  async update(id: Lesson['id'], payload: UpdateLessonDto): Promise<BaseResponseDto<LessonResponseType>> {
    const lesson = await this.lessonRepository.save(this.lessonRepository.create({ id, ...payload }));

    return ResponseHelper.success(lesson);
  }

  async softDelete(id: Lesson['id']): Promise<void> {
    void this.lessonRepository.softDelete(id);
  }

  async countComment(courseId: number, userId: number): Promise<BaseResponseDto<number[]>> {
    const query = this.lessonRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Lesson.comments', 'comments')
      .select('COUNT(comments.id)', 'commentCount');

    query.leftJoinAndSelect('Lesson.course', 'course');
    query.leftJoinAndSelect('Lesson.user', 'user');
    query.leftJoin('course.members', 'member', 'member.user_id = :userId', { userId });
    query.andWhere(
      new Brackets((qb) => {
        qb.where('Lesson.publish = :public', { public: AppConstant.PUBLISH_OPTION_PUBLIC }).orWhere(
          new Brackets((qb2) => {
            qb2
              .where('Lesson.publish = :private', { private: AppConstant.PUBLISH_OPTION_PRIVATE })
              .andWhere('member.user_id IS NOT NULL');
          }),
        );
      }),
    );

    if (courseId) {
      query.andWhere('Lesson.course_id = :id', {
        id: courseId,
      });
    }

    const commentCounts = await query.groupBy('Lesson.id, course.id, user.id').distinctOn(['Lesson.id']).getRawMany();
    const uniqueCommentCounts = [...new Set(commentCounts.map((item) => item.commentCount))];
    const total = uniqueCommentCounts.sort((a, b) => a - b);

    return ResponseHelper.success(total);
  }

  async updateStatus(id: number, status: string, dto: CancelLessonDto) {
    let update;
    if (status === 'Hủy') {
      update = await this.lessonRepository
        .createQueryBuilder('lesson')
        .update(Lesson)
        .set({ status: status, reason: dto.reason })
        .where('id = :id', { id })
        .execute();
    } else {
      update = await this.lessonRepository
        .createQueryBuilder('lesson')
        .update(Lesson)
        .set({ status: status })
        .where('id = :id', { id })
        .execute();
    }

    return update;
  }
}
