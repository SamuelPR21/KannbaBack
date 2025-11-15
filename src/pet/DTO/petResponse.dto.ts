import { IsNumber, IsString, IsDate } from "class-validator";

export class PetResponseDTO {
  
  @IsNumber()
    id: number;
}