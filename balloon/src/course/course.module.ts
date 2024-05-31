import { Module, forwardRef } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Member } from './entities/member.entity';
import { ShareModule } from 'src/utils/share.module';
import { Invite } from './entities/invite.entity';
import { InviteService } from './invite.service';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { Category } from './entities/category.entity';
import { Commission } from './entities/commission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Member, Invite, Category, Commission]),
    ShareModule,
    MailModule,
    UsersModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [CourseController],
  providers: [CourseService, MemberService, InviteService],
  exports: [CourseService, MemberService, InviteService],
})
export class CourseModule {}
