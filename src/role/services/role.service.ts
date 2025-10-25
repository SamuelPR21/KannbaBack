import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../role.entity";
import { RoleRequestDTO } from "../DTO/roleRequestDTO.dto";
import { RoleResponseDTO } from "../DTO/roleResponseDTO.dto";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async createRole(roleRequestDTO: RoleRequestDTO): Promise<RoleResponseDTO> {
        const existingRole = await this.roleRepository.findOne({
            where: { name: roleRequestDTO.name },
        });
        if (existingRole) {
            throw new ConflictException(`El rol "${roleRequestDTO.name}" ya existe.`);
        }

        const role = this.roleRepository.create(roleRequestDTO);
        const savedRole = await this.roleRepository.save(role);
        return new RoleResponseDTO(savedRole);
    }

    async delete(id: number): Promise<{ message: string }> {
        const result = await this.roleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Rol con ID ${id} no encontrado.`);
        }
        return { message: "Rol eliminado correctamente." };
    }

    async findAll(): Promise<RoleResponseDTO[]> {
        const roles = await this.roleRepository.find();
        if (!roles.length) {
            throw new NotFoundException("No hay roles registrados.");
        }
        return roles.map((role) => new RoleResponseDTO(role));
    }

    async findRolById(id: number): Promise<RoleResponseDTO>{
        const role = await this.roleRepository.findOne({where: {id}});
        if(!role){
            throw new NotFoundException(`Rol con ID ${id} no encontrado.`);
        }
        return new RoleResponseDTO(role);
    }
}
