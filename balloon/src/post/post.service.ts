import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CommonService } from 'src/utils/services/common.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { PostResponseType } from './types/post-response.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ApiException } from 'src/utils/exceptions/api.exception';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { ListPaginationPostResponseType } from './types/list-pagination-post.type';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private commonService: CommonService,
  ) {}

  async create(dto: CreatePostDto): Promise<BaseResponseDto<PostResponseType>> {
    const post = await this.postRepository.save(this.postRepository.create(dto));

    return ResponseHelper.success(post);
  }

  async findManyWithPagination(paginationDto: FilterPostDto): Promise<BaseResponseDto<ListPaginationPostResponseType>> {
    const query = this.postRepository.createQueryBuilder();

    if (paginationDto.keyword) {
      query.where('(LOWER(Post.content) LIKE :keyword OR LOWER(Post.name) LIKE :keyword)', {
        keyword: `%${paginationDto.keyword.toString().toLowerCase()}%`,
      });
    }

    if (paginationDto.id) {
      query.andWhere('Post.id = :id', {
        id: paginationDto.id,
      });
    }

    if (paginationDto.courseId) {
      const queryCondition = this.commonService.createQueryMultipleValue(paginationDto.courseId, 'Post', 'course_id');

      if (queryCondition.queryString && queryCondition.parameters) {
        query.andWhere(queryCondition.queryString, queryCondition.parameters);
      }
    }

    query.leftJoinAndSelect('Post.commentsTop', 'comment');
    query.orderBy('Post.id', 'DESC');
    query.addOrderBy('comment.createdAt', 'DESC');

    return this.commonService.getDataByPagination(paginationDto, query);
  }

  async findOne(fields: EntityCondition<Post>): Promise<BaseResponseDto<PostResponseType>> {
    const post = await this.postRepository.findOne({
      where: fields,
    });

    if (!post) {
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

    return ResponseHelper.success(post);
  }

  async update(id: Post['id'], dto: UpdatePostDto): Promise<BaseResponseDto<PostResponseType>> {
    const post = await this.postRepository.save(
      this.postRepository.create({
        id,
        ...dto,
      }),
    );

    return ResponseHelper.success(post);
  }

  async softDelete(id: Post['id']) {
    void this.postRepository.softDelete(id);
  }
}
