import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskProyectDto {
  @IsNotEmpty() @IsString()
  name: string;

  @IsOptional() @IsString()
  description?: string;

  @IsNotEmpty() @IsInt()
  userProyectId: number;

  @IsNotEmpty() @IsInt()
  stateId: number;
}
