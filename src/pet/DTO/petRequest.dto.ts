import { IsNumber, IsString, IsDate } from "class-validator";

export class PetRequestDTO {
  

  @IsString()
    type: number;

  @IsString()
    state: string;

  @IsNumber()
    weightKg: number;

  @IsDate()
    date_last_meal: Date;  
  
}