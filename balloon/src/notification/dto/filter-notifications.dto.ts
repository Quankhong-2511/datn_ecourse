import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class FilterNotificationDto {
  @ApiProperty({ example: 3 })
  @ValidationDecorator([
    { rule: 'optional' },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.FIELD_INVALID } } },
    { rule: 'min', params: { number: 0, validationOptions: { message: ErrorCodeEnum.NUMBER_MUST_BE_MORE_THAN_0 } } },
  ])
  filter3month: number;

  @ApiProperty({ example: 2023 })
  @ValidationDecorator([
    { rule: 'optional' },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.FIELD_INVALID } } },
    { rule: 'min', params: { number: 0, validationOptions: { message: ErrorCodeEnum.NUMBER_MUST_BE_MORE_THAN_0 } } },
  ])
  year: number;
}
