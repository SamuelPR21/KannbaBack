import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateTaskPersonalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  stateId?: number;
}
