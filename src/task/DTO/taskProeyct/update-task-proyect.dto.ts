import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTaskProyectDto {
  @IsOptional() @IsString()
  name?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsInt()
  userProyectId?: number;

  @IsOptional() @IsInt()
  stateId?: number; 
}
