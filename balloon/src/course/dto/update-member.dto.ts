import { ApiProperty } from '@nestjs/swagger';
import { AppConstant } from 'src/utils/app.constant';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class UpdateMemberDto {
  @ApiProperty({ example: 1 })
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.STATUS_IS_REQUIRED } } },
    {
      rule: 'isIn',
      params: {
        value: [AppConstant.STATUS_MEMBER_PASS, AppConstant.STATUS_MEMBER_PENDING],
        validationOptions: { message: ErrorCodeEnum.STATUS_IS_IN_LIST },
      },
    },
  ])
  status: number;
}
