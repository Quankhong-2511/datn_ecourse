import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthOTPDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { User } from '../users/entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { EmailExistsDto } from './dto/email-exists.dto';
import { EmailExistsResponseType } from './types/email-exists-response.type';
import { Response as ResponseType } from 'express';
import { ResponseHelper } from '../utils/helpers/response.helper';
import { MemberService } from 'src/course/member.service';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { changePasswordCustomDto } from './dto/change-password-custom.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly memberService: MemberService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/exists')
  @HttpCode(HttpStatus.OK)
  public checkEmailExists(@Body() loginDto: AuthLoginDto): Promise<BaseResponseDto<EmailExistsResponseType>> {
    return this.service.checkEmailExists(loginDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthOTPDto, @Res({ passthrough: true }) res: ResponseType) {
    return this.service.validateLogin(loginDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('admin/email/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: AuthOTPDto, @Res({ passthrough: true }) res: ResponseType) {
    return this.service.validateLogin(loginDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<BaseResponseDto<EmailExistsResponseType>> {
    return this.service.register(createUserDto);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me', 'login'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request) {
    const listCourse = await this.memberService.getCourseByUserId(request.user.id);
    const courseIdList = listCourse.map((course) => course.courseId);
    const me = await this.service.me(request.user);
    return { me: me, listCourse: courseIdList };
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(@Request() request): Promise<Omit<LoginResponseType, 'user'>> {

    return this.service.refreshToken({
      sessionId: request.user.sessionId,
    });
  }

  @Post("forgot/password")
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset/password")
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiBearerAuth()
  @Post("changePasswordCustom")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePasswordCustom(
    @Body() changePassword: changePasswordCustomDto,
    @Request() request,
  ): Promise<string> {
    return this.service.changePassword(changePassword, request.user.id);
  }


  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request, @Res({ passthrough: true }) res: ResponseType): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public update(@Request() request, @Body() userDto: AuthUpdateDto): Promise<NullableType<User>> {
    return this.service.update(request.user, userDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Request() request, @Res({ passthrough: true }) res: ResponseType): Promise<void> {
    await this.service.softDelete(request.user);

    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }
}
