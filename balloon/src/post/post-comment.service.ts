import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { Repository } from 'typeorm';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { PostCommentResponseType } from './types/post-comment-response.type';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
  ) {}

  async create(dto: CreatePostCommentDto): Promise<BaseResponseDto<PostCommentResponseType>> {
    const comment = await this.postCommentRepository.save(this.postCommentRepository.create(dto));
    return ResponseHelper.success(comment);
  }
}
