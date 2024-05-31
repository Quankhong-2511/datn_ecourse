import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CommonService } from 'src/utils/services/common.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionResponseType } from './types/question-response.type';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Post } from 'src/post/entities/post.entity';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FilterQuestionDto } from './dto/filter-question.dto';
import { ListPaginationQuestionResponseType } from './types/list-pagination-question.type';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private commonService: CommonService,
  ) {}

  async create(dto: CreateQuestionDto): Promise<BaseResponseDto<QuestionResponseType>> {
    const question = await this.questionRepository.save(this.questionRepository.create(dto));

    return ResponseHelper.success(question);
  }

  async findManyWithPagination(
    paginationDto: FilterQuestionDto,
  ): Promise<BaseResponseDto<ListPaginationQuestionResponseType>> {
    const query = this.questionRepository.createQueryBuilder();

    if (paginationDto.keyword) {
      query.where('(LOWER(Question.content) LIKE :keyword OR LOWER(Question.name) LIKE :keyword)', {
        keyword: `%${paginationDto.keyword.toString().toLowerCase()}%`,
      });
    }

    if (paginationDto.id) {
      query.andWhere('Question.id = :id', {
        id: paginationDto.id,
      });
    }

    if (paginationDto.courseId) {
      const queryCondition = this.commonService.createQueryMultipleValue(
        paginationDto.courseId,
        'Question',
        'course_id',
      );

      if (queryCondition.queryString && queryCondition.parameters) {
        query.andWhere(queryCondition.queryString, queryCondition.parameters);
      }
    }

    query.leftJoinAndSelect('Question.commentsTop', 'comment');
    query.orderBy('Question.id', 'DESC');
    query.addOrderBy('comment.createdAt', 'DESC');

    return this.commonService.getDataByPagination(paginationDto, query);
  }

  async findOne(fields: EntityCondition<Post>): Promise<BaseResponseDto<QuestionResponseType>> {
    const question = await this.questionRepository.findOne({
      where: fields,
    });

    if (!question) {
      throw new ApiException(
        {
          id: ErrorCodeEnum.NOT_FOUND,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          id: fields,
        },
      );
    }

    return ResponseHelper.success(question);
  }

  async update(id: Question['id'], dto: UpdateQuestionDto): Promise<BaseResponseDto<QuestionResponseType>> {
    const question = await this.questionRepository.save(
      this.questionRepository.create({
        id,
        ...dto,
      }),
    );

    return ResponseHelper.success(question);
  }

  async softDelete(id: Question['id']) {
    void this.questionRepository.softDelete(id);
  }
}
