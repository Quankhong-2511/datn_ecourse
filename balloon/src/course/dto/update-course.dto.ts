import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class UpdateCourseDto {
  @ApiProperty({ example: 'Lớp học lập trình cơ bản' })
  @ValidationDecorator([{ rule: 'optional' }])
  name: string;

  @ApiProperty({ example: 'Mô tả khóa học' })
  @ValidationDecorator([{ rule: 'optional' }])
  content: string;

  @ApiProperty({ type: [] })
  @ValidationDecorator([{ rule: 'optional' }])
  file?: string;

  @ApiProperty({ example: 'Mô tả khóa học' })
  @ValidationDecorator([{ rule: 'optional' }])
  discount: number;
}
