import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';
import { MinLength } from 'class-validator';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.EMAIL_NOT_EXISTS } } },
    { rule: 'email', params: { validationOptions: { message: ErrorCodeEnum.IS_EMAIL } } },
    {
      rule: 'isNotExist',
      params: { entity: ['User'], validationOptions: { message: ErrorCodeEnum.EMAIL_IS_NOT_EXISTS } },
    },
  ])
  email: string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @ValidationDecorator([{ rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.NAME_REQUIRED } } }])
  name: string;

  @ApiProperty({ example: '0987654321' })
  @ValidationDecorator([{ rule: 'string', params: { validationOptions: { message: ErrorCodeEnum.ID_IS_INT } } }])
  phone?: string;
}
