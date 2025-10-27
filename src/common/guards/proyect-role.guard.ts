import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PROYECT_ROLE_KEY } from "../decorator/proyect-role.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProyect } from "src/user_Proyetc/userProyect.entity";

@Injectable()
export class ProyectRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(UserProyect)
        private readonly userProyectRepository: Repository<UserProyect>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>(PROYECT_ROLE_KEY, context.getHandler());
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        let targetUserProyect: UserProyect | null = null;
        let actingUserProyect: UserProyect | null = null;

        //  Identificar el registro target (sobre el que se actúa)
        if (request.params.id) {
            targetUserProyect = await this.userProyectRepository.findOne({
                where: { id: Number(request.params.id) },
                relations: ['proyect', 'role', 'user'],
            });

            if (!targetUserProyect) {
                throw new ForbiddenException('No se encontró la relación usuario-proyecto a modificar/eliminar');
            }
        }

        // Determinar el proyecto (para POST, PATCH o DELETE)
        const proyectId = targetUserProyect?.proyect.id || Number(request.params.proyectId || request.params.idProyect || request.body.proyectId);
        if (!proyectId) {
            throw new ForbiddenException('No se proporcionó ID para el proyecto');
        }

        // 3 Obtener relación del usuario que actúa
        actingUserProyect = await this.userProyectRepository.findOne({
            where: {
                user: { id: user.id },
                proyect: { id: proyectId },
            },
            relations: ['proyect', 'role', 'user'],
        });

        if (!actingUserProyect) {
            throw new ForbiddenException('No pertenece al proyecto');
        }

        //  Verificar si el rol del usuario que actúa es válido para la acción
        const hasRole = roles.includes(actingUserProyect.role.name);
        if (!hasRole) {
            throw new ForbiddenException('No tienes permiso para realizar esta acción');
        }

        // 5️ Reglas adicionales según acción

        if (targetUserProyect) {
            
            if (actingUserProyect.user.id === targetUserProyect.user.id) {
                throw new ForbiddenException('No puedes eliminarte a ti mismo'); 
                return true; 
            }

            if (actingUserProyect.role.name === 'MANAGER') {
                return true;
            }

            throw new ForbiddenException('Solo un manager puede modificar o eliminar usuarios de un proyecto');
        }

        return true;
    }
}
