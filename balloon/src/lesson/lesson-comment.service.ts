import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonComment } from './entities/lesson-comment.entity';
import { Repository } from 'typeorm';
import { CreateLessonCommentDto } from './dto/create-lesson-comment.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';

@Injectable()
export class LessonCommentService {
  constructor(
    @InjectRepository(LessonComment)
    private lessonCommentRepository: Repository<LessonComment>,
  ) {}

  async create(dto: CreateLessonCommentDto) {
    const comment = await this.lessonCommentRepository.save(this.lessonCommentRepository.create(dto));
    return comment;
  }
}
