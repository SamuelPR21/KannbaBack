import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { UserProyect } from "../userProyect.entity";
import { Proyect } from "../../proyect/proyect.entity";
import { Role } from "src/role/role.entity";
import { User } from "src/users/users.entity";
import { UserProyectResponseDTO } from "../DTO/userProyectResponse.dto";
import { UserProyectRequestDTO } from "../DTO/userProyectRequest.dto";
import { UserByProyectResponseDTO } from "../DTO/UserByProyectResposeDTO.dto";
import { ProyectByUserResponseDTO } from "../DTO/ProyectByUserResponseDTO.dto";


@Injectable()
export class UserProyectService {
    constructor(
        @InjectRepository(UserProyect)
        private readonly userProyectRepository: Repository<UserProyect>,
        @InjectRepository(Proyect)
        private readonly proyectRepository: Repository<Proyect>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}


    async createUserProyect(userProyectRequestDTO: UserProyectRequestDTO): Promise<UserProyectResponseDTO> {
        const existingRole = await this.roleRepository.findOne({
            where: { id: userProyectRequestDTO.roleId },
        })

        if (!existingRole) {
            throw new NotFoundException(`El rol con ID "${userProyectRequestDTO.proyectId}" no existe.`);
        }

        const existingUser = await this.userRepository.findOne({
            where: { id: userProyectRequestDTO.userId },
        })

        if (!existingUser) {
            throw new NotFoundException(`El usuario con ID "${userProyectRequestDTO.userId}" no existe.`);
        }

        const existingProyect = await this.proyectRepository.findOne({
            where: { id: userProyectRequestDTO.proyectId },
        })

        if (!existingProyect) {
            throw new NotFoundException(`El proyecto con ID "${userProyectRequestDTO.proyectId}" no existe.`);
        }


        const existingRelation = await this.userProyectRepository.findOne({
            where: {
                user: { id: userProyectRequestDTO.userId },
                proyect: { id: userProyectRequestDTO.proyectId },
            },
            relations: ['user', 'proyect'],
        });
        
        if (existingRelation) {
            throw new ConflictException(`El usuario ya está asignado a este proyecto.`);
        }
        

        const userProyct = this.userProyectRepository.create({
            role: existingRole,
            user: existingUser,
            proyect: existingProyect,

            ...userProyectRequestDTO

        })
        const savedUserProyect = await this.userProyectRepository.save(userProyct);
        return new UserProyectResponseDTO(savedUserProyect);
   
    }

    async listAllUserByProyect(proyectId: number): Promise<UserByProyectResponseDTO[]> {
        const userProyects = await this.userProyectRepository.find({
            where: { proyect: { id: proyectId } },
            relations: ['user', 'proyect', 'role'],
        });

        if (!userProyects.length) {
            throw new NotFoundException(`No se encontraron usuarios para el proyecto con ID "${proyectId}".`);
        }

        return userProyects.map((up) => new UserByProyectResponseDTO({
            userId: up.user.id,
            userName: up.user.username,
            email: up.user.email,
            role: up.role.name,
        }));
    }

    async listAllProyectsByUser(userId: number): Promise<ProyectByUserResponseDTO[]> {
        const userProyects = await this.userProyectRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'proyect', 'role', 'proyect.category'],
        });

        if (!userProyects.length) {
            throw new NotFoundException(`No se encontraron proyectos para el usuario con ID "${userId}".`);
        }

        return userProyects.map((up) => new ProyectByUserResponseDTO({
            proyectId: up.proyect.id,
            proyectName: up.proyect.name,
            categoryName: up.proyect.category?.name,
            role: up.role.name,
        }));
    }

    async deleteUserProyect(id: number): Promise<{message : string}> {
        const result = await this.userProyectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`UserProyect con ID ${id} no encontrado.`);
        }
        return { message: "UserProyect eliminado correctamente." };
    }

    async changeRoleByIdUserandIdProyect(userId: number, proyectId: number, userProyectRequestDTO: UserProyectRequestDTO): Promise<UserProyectResponseDTO> {
        const userProyect = await this.userProyectRepository.findOne({
            where: {
                user: { id: userId },
                proyect: { id: proyectId },
            },
            relations: ['user', 'proyect', 'role'],
        });

        if (!userProyect) {
            throw new NotFoundException(`No se encontró la relación entre el usuario con ID "${userId}" y el proyecto con ID "${proyectId}".`);
        }
        const newRole = await this.roleRepository.findOne({
            where: { id: userProyectRequestDTO.roleId },
        });

        if (!newRole) {
            throw new NotFoundException(`El rol con ID "${userProyectRequestDTO.roleId}" no existe.`);
        }

        userProyect.role = newRole;
        const updatedUserProyect = await this.userProyectRepository.save(userProyect);
        return new UserProyectResponseDTO(updatedUserProyect);
    }


}
