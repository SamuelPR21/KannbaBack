import { IsString, IsNumber } from "class-validator";

export class UserProyectRequestDTO {
    @IsNumber()
    proyectId: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    roleId: number;

    constructor(partial: Partial<UserProyectRequestDTO>) {
        Object.assign(this, partial);
    }
}