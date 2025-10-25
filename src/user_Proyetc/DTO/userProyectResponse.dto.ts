import { IsNumber, IsString } from "class-validator";
import { UserProyect } from "../userProyect.entity";

export class UserProyectResponseDTO {
    @IsNumber()
    id: number;

    @IsNumber()
    proyectId: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    roleId: number;

    constructor(userProyect: UserProyect) {
        this.id = userProyect.id;
        this.proyectId = userProyect.proyect.id;
        this.userId = userProyect.user.id;
        this.roleId = userProyect.role.id;
    }
}