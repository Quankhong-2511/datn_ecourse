import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class DeleteFileDto {
  @ApiProperty({ type: [], example: ['images/2ecb6bd24a3ad68da9970.png'] })
  @ValidationDecorator([{ rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.FILE_REQUIRED } } }])
  path: string[];
}
