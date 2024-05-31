import { ApiProperty } from '@nestjs/swagger';
import { AppConstant } from 'src/utils/app.constant';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class CreateMemberDto {
  @ApiProperty({ example: 1 })
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.ID_REQUIRED } } },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.ID_IS_INT } } },
  ])
  courseId: number;

  @ApiProperty({ example: 1 })
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.ROLE_REQUIRED } } },
    {
      rule: 'isIn',
      params: {
        value: [AppConstant.ROLE_ADMIN, AppConstant.ROLE_MEMBER],
        validationOptions: { message: ErrorCodeEnum.PUBLISH_OPTION_IS_IN_LIST },
      },
    },
  ])
  role: number;

  @ApiProperty({ example: 1 })
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.ID_REQUIRED } } },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.ID_IS_INT } } },
  ])
  userId: number;

  status?: number;

  @ValidationDecorator([
    { rule: 'optional' },
  ])
  reduced?: number;

  price?: number
}
