import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class UpdateCommissionDto {
  @ApiProperty({ example: 30 })
  @IsInt()
  level_1: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  level_2: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  level_3: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  level_4: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  level_5: number;
}
