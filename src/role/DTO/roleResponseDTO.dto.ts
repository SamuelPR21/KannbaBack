import { IsNumber, IsString } from "class-validator";
import { Role } from "../role.entity";

export class RoleResponseDTO {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    constructor(role:Role){
        this.id = role.id;
        this.name = role.name;
    }
}