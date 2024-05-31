import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ example: "Danh mục 1" })
  @IsNotEmpty()
  @IsString()
  title: string;
}
