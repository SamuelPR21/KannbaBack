import { IsNumber } from "class-validator";

export class AssigUserToProyectDTO {
  @IsNumber()
  userId: number;   

  @IsNumber()
  proyectId: number;

  @IsNumber()
  roleId: number;

  constructor(partial: Partial<AssigUserToProyectDTO>) {
    Object.assign(this, partial);
  }
}
