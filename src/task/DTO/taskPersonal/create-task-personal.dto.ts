import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskPersonalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  stateId: number;
}
