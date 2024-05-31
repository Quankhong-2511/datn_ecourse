import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class CreateCourseDto {
  @ApiProperty({ example: 'Lớp học lập trình cơ bản' })
  @ValidationDecorator([{ rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.NAME_REQUIRED } } }])
  name: string;

  @ApiProperty({ example: 'Mô tả khóa học' })
  @ValidationDecorator([{ rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.NAME_REQUIRED } } }])
  content: string;

  @ApiProperty({ example: 0 })
  @ValidationDecorator([
    { rule: 'optional' },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.PRICE_IS_INT } } },
  ])
  price: number;

  @ApiProperty({ example: 1 })
  @ValidationDecorator([
    { rule: 'optional' },
    { rule: 'int', params: { validationOptions: { message: ErrorCodeEnum.PRICE_IS_INT } } },
  ])
  category: number;

  @ApiProperty({ example: "New category" })
  @ValidationDecorator([
    { rule: 'optional' },
    { rule: 'string', params: { validationOptions: { message: ErrorCodeEnum.PRICE_IS_INT } } },
  ])
  categoryName: string;

  @ApiProperty({ type: [] })
  @ValidationDecorator([{ rule: 'optional' }])
  file?: string;

  status: string  = 'Chờ duyệt';
}
