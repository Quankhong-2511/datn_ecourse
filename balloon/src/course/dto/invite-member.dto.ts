import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { AppConstant } from 'src/utils/app.constant';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class InviteMemberDto {
  @ApiProperty({ example: 'Quan' })
  @IsOptional()
  // @ValidationDecorator([{ rule: 'optional', params: { validationOptions: { message: ErrorCodeEnum.NAME_REQUIRED } } }])
  name: string = "HS mới mời";

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.ID_REQUIRED } } },
    { rule: 'email', params: { validationOptions: { message: ErrorCodeEnum.IS_EMAIL } } },
  ])
  email: string;

  @ApiProperty({ example: 2 })
  @IsOptional()
  @ValidationDecorator([
    {
      rule: 'isIn',
      params: {
        value: [AppConstant.ROLE_MEMBER],
        validationOptions: { message: ErrorCodeEnum.ROLE_OPTION_IS_IN_LIST },
      },
    },
  ])
  // @ValidationDecorator([{ rule: 'optional', params: { validationOptions: { message: ErrorCodeEnum.ROLE_REQUIRED } } }])
  role: number;

  @ApiProperty({ example: '0987654321' })
  // @ValidationDecorator([{ rule: 'v', params: { validationOptions: { message: ErrorCodeEnum.NAME_REQUIRED } } }])
  @IsOptional()
  phone: string;
}
