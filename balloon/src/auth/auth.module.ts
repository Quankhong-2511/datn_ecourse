import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { SessionModule } from 'src/session/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MemberService } from 'src/course/member.service';
import { CourseModule } from 'src/course/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/course/entities/member.entity';
import { ForgotModule } from 'src/forgot/forgot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    UsersModule,
    SessionModule,
    ForgotModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
    forwardRef(() => CourseModule),
  ],
  controllers: [AuthController],
  providers: [IsExist, IsNotExist, AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy, MemberService],
  exports: [AuthService],
})
export class AuthModule {}
