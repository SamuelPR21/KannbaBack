import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty() @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty() @IsString()
  nameComlpete: string;

  @IsNotEmpty() @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  oficio?: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional() @IsEnum(['ESTUDIO', 'TRABAJO', 'PERSONAL'])
  purpose?: string;
}
