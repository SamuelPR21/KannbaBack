import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTaskProyectDto {
  @IsOptional() @IsString()
  name?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsInt()
  userProyectId?: number; // cambiar responsable

  @IsOptional() @IsInt()
  stateId?: number; // cambiar estado
}
