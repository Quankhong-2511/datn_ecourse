import { ApiProperty } from '@nestjs/swagger';
import { AppConstant } from 'src/utils/app.constant';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class CancelLessonDto {
  @ApiProperty({ example: 'Content' })
  @ValidationDecorator([{ rule: 'optional' }])
  reason: string;
}
