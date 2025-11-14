import { IsInt, IsOptional } from 'class-validator';

export class CreateTaskHistoryDto {
  @IsOptional()
  @IsInt()
  taskPersonalId?: number;

  @IsOptional()
  @IsInt()
  taskProyectId?: number;

  @IsInt()
  oldStateId: number;

  @IsInt()
  newStateId: number;
}
