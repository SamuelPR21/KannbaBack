import { IsNumber, IsString } from "class-validator";


export class ProyectRequestDTO {
  
  @IsString()
  name: string;

  @IsNumber()
   categoryId: number;

}