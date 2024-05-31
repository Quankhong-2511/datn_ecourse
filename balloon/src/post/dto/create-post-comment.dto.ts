import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class CreatePostCommentDto {
  @ApiProperty({ example: 1 })
  @ValidationDecorator([
    { rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.ID_REQUIRED } } },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.ID_IS_INT } } },
  ])
  postId: number;

  @ApiProperty({ type: [] })
  @ValidationDecorator([{ rule: 'optional' }])
  file?: string;

  @ApiProperty({ example: 'Content' })
  @ValidationDecorator([{ rule: 'optional' }])
  content?: string;
}
