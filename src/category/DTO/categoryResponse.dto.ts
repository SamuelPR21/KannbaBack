import { IsString, IsEmail, IsNumber } from "class-validator";

export class CategoryResponseDTO {
  
  @IsNumber()
  id: number;
  
  @IsString()
  name: string;

}