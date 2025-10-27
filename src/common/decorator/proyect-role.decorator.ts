import { SetMetadata } from "@nestjs/common";

export const PROYECT_ROLE_KEY = "proyect-role";
export const ProyectRoles = (...roles: string[]) => SetMetadata(PROYECT_ROLE_KEY, roles);