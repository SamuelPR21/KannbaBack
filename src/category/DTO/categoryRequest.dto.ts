import { IsString } from "class-validator";

export class CategoryRequestDTO {
  
  @IsString()
  name: string;

}