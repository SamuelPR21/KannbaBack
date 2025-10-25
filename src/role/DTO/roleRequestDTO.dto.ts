import { IsString } from "class-validator";

export class RoleRequestDTO {
    @IsString()
    name: string;

    constructor(partial: Partial<RoleRequestDTO>) {
        Object.assign(this, partial);
    }

}