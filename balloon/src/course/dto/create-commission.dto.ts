import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommissionDto {
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  number: number;
}
