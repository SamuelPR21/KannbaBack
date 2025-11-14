import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskProyectDto {
  @IsNotEmpty() @IsString()
  name: string;

  @IsOptional() @IsString()
  description?: string;

  // responsable = registro en user_proyect
  @IsNotEmpty() @IsInt()
  userProyectId: number;

  @IsNotEmpty() @IsInt()
  stateId: number;
}
