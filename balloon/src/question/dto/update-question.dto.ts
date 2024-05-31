import { ApiProperty } from '@nestjs/swagger';
import { AppConstant } from 'src/utils/app.constant';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class UpdateQuestionDto {
  @ApiProperty({ example: 'Content' })
  @ValidationDecorator([{ rule: 'optional' }])
  content: string;

  @ApiProperty({ type: [] })
  @ValidationDecorator([{ rule: 'optional' }])
  file?: string;

  @ApiProperty({
    description: '1: Public, 2: Private',
    example: '1: Public, 2: Private',
  })
  @ValidationDecorator([
    { rule: 'optional' },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.PUBLISH_OPTION_IS_INT } } },
    {
      rule: 'isIn',
      params: {
        value: [AppConstant.PUBLISH_OPTION_PRIVATE, AppConstant.PUBLISH_OPTION_PUBLIC],
        validationOptions: { message: ErrorCodeEnum.PUBLISH_OPTION_IS_IN_LIST },
      },
    },
  ])
  publish: number;

  @ApiProperty({ example: 'Nest Js' })
  @ValidationDecorator([{ rule: 'optional' }])
  tag: string;
}
