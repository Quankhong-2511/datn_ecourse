import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostCommentService } from './post-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostComment } from './entities/post-comment.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { ShareModule } from 'src/utils/share.module';
import { CourseModule } from 'src/course/course.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostComment, FileEntity]), ShareModule, CourseModule],
  controllers: [PostController],
  providers: [PostService, PostCommentService, FilesService],
  exports: [PostService, PostCommentService],
})
export class PostModule {}
