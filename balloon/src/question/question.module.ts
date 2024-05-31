import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionCommentService } from './question-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionComment } from './entities/question-comment.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { ShareModule } from 'src/utils/share.module';
import { CourseModule } from 'src/course/course.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionComment, FileEntity]), ShareModule, CourseModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionCommentService, FilesService],
  exports: [QuestionService, QuestionCommentService],
})
export class QuestionModule {}
