import { IsNumber, IsString } from "class-validator";


export class ProyectResponseDTO {
  
  @IsNumber()
  id: number;

  @IsString()
  name: string;
 
  @IsNumber()
  categoryId: number;

}