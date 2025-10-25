import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional() @IsString()
  nameComlpete?: string;

  @IsOptional() @IsString()
  oficio?: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional() @IsEnum(['ESTUDIO', 'TRABAJO', 'PERSONAL'])
  purpose?: string;
}
