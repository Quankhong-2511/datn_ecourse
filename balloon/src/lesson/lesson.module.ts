import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonCommentService } from './lesson-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { LessonComment } from './entities/lesson-comment.entity';
import { ShareModule } from 'src/utils/share.module';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { CourseModule } from 'src/course/course.module';
import { CommentGateway } from './comment.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonComment, FileEntity]), ShareModule, CourseModule],
  controllers: [LessonController],
  providers: [LessonService, LessonCommentService, FilesService, CommentGateway],
  exports: [LessonService, LessonCommentService, FilesService],
})
export class LessonModule {}
