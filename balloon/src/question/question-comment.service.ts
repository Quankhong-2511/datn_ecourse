import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionComment } from './entities/question-comment.entity';
import { Repository } from 'typeorm';
import { CreateQuestionCommentDto } from './dto/create-question-comment.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { QuestionCommentResponseType } from './types/question-comment-response.type';

@Injectable()
export class QuestionCommentService {
  constructor(
    @InjectRepository(QuestionComment)
    private questionCommentService: Repository<QuestionComment>,
  ) {}

  async create(dto: CreateQuestionCommentDto): Promise<BaseResponseDto<QuestionCommentResponseType>> {
    const comment = await this.questionCommentService.save(this.questionCommentService.create(dto));
    return ResponseHelper.success(comment);
  }
}
