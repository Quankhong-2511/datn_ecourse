import { ApiProperty } from '@nestjs/swagger';
import { AppConstant } from 'src/utils/app.constant';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class BuyCourseDto {
  @ApiProperty({ example: 1 })
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.ID_REQUIRED } } },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.ID_IS_INT } } },
  ])
  courseId: number;
}
