import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'Quan' })
  @IsString()
  @ValidationDecorator([{ rule: 'optional' }])
  name: string;

  @ApiProperty({ type: [] })
  @ValidationDecorator([{ rule: 'optional' }])
  file?: string;

  @ApiProperty({ example: 'describe' })
  @ValidationDecorator([{ rule: 'optional' }])
  phone: string;

  // @ApiProperty({ example: 1000000 })
  // @ValidationDecorator([{ rule: 'optional' }])
  // extraMoney: number;

  // availableBalances: number;
}
