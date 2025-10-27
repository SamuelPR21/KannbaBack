import { IsNumber, IsString } from "class-validator";


export class AssigUserToProyectDTO {
    @IsNumber()
    proyectId: number;

    @IsNumber()
    username: string;

    @IsNumber()
    roleId: number;

    constructor(partial: Partial<AssigUserToProyectDTO>) {
        Object.assign(this, partial);
    }
}