import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class BuyCourseWithLinkDto {
  @ApiProperty({
    example: 'fae34812-bf19-4593-93f2-98e5e1f10dd5',
  })
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.ID_REQUIRED } } },
    {
      rule: 'string',
      params: { validationOptions: { message: ErrorCodeEnum.UUID_INVALID } },
    },
  ])
  uuid: string;
}
