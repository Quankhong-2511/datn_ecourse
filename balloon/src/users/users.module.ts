import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { ShareModule } from 'src/utils/share.module';
import { User } from './entities/user.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { Member } from 'src/course/entities/member.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FileEntity, Member, Course]), ShareModule],
  controllers: [UsersController],
  providers: [IsExist, IsNotExist, UsersService, FilesService],
  exports: [UsersService, FilesService],
})
export class UsersModule {}
