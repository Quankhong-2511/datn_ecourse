import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { FileEntity } from '../../files/entities/file.entity';
import { ValidationDecorator } from 'src/utils/decorators/validation.decorator';
import { ErrorCodeEnum } from 'src/utils/error-code.enum';

export class AuthUpdateDto {
  @ApiProperty({ example: 'Quan' })
  @ValidationDecorator([{ rule: 'required', params: { validationOptions: { message: ErrorCodeEnum.NAME_REQUIRED } } }])
  name: string | null;

  @ApiProperty({ type: [] })
  @ValidationDecorator([{ rule: 'optional' }])
  file?: string;

  @ApiProperty({ example: 'describe' })
  @ValidationDecorator([{ rule: 'optional' }])
  phone: string;
}
