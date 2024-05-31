import { ApiProperty } from '@nestjs/swagger';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class FilterCourseDto extends PaginationDto {
  @ApiProperty()
  @ValidationDecorator([{ rule: 'optional' }])
  id: number;

  @ApiProperty()
  @ValidationDecorator([{ rule: 'optional' }])
  categoryId: number;

  @ApiProperty()
  @ValidationDecorator([{ rule: 'optional' }])
  userId: number;

  @ApiProperty()
  @ValidationDecorator([{ rule: 'optional' }])
  statusLesson: string;
}
