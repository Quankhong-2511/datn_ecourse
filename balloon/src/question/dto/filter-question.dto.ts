import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class FilterQuestionDto extends PaginationDto {
  @ApiProperty({ example: 1 })
  @ValidationDecorator([{ rule: 'optional' }])
  id: number;

  @ApiProperty({ example: 1 })
  @ValidationDecorator([{ rule: 'optional' }])
  courseId: number;
}
