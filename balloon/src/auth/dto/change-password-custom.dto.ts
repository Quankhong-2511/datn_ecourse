import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { Column } from "typeorm";

export class changePasswordCustomDto {
  @ApiProperty()
  @Column({ type: String })
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty()
  @Column({ type: String })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @Column({ type: String })
  @IsNotEmpty()
  @MinLength(6)
  rePassword: string;
}
