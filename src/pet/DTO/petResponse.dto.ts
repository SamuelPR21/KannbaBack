import { IsNumber, IsString, IsDate } from "class-validator";

export class PetResponseDTO {
  
  @IsNumber()
    id: number;

  @IsString()
    type: number;

  @IsString()
    state: string;

  @IsNumber()
    weightKg: number;

  @IsDate()
    date_last_meal: Date;  
  
}