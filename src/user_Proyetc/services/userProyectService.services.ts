import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProyect } from "../userProyect.entity";
import { Proyect } from "../../proyect/proyect.entity";
import { Role } from "src/role/role.entity";
import { User } from "src/users/users.entity";
import { UserProyectResponseDTO } from "../DTO/userProyectResponse.dto";
import { UserProyectRequestDTO } from "../DTO/userProyectRequest.dto";
import { UserByProyectResponseDTO } from "../DTO/UserByProyectResposeDTO.dto";
import { ProyectByUserResponseDTO } from "../DTO/ProyectByUserResponseDTO.dto";
import { AssigUserToProyectDTO } from "../DTO/AssigUserToProyectDTO.dto";
import { UserNotInProyectResponseDTO } from "../DTO/UserNotInProyectResponse.dto";

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
  ) {}


  async createUserProyect(dto: AssigUserToProyectDTO): Promise<UserProyectResponseDTO> {

    const role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
    if (!role) {
      throw new NotFoundException(`El rol con ID "${dto.roleId}" no existe.`);
    }

    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`El usuario con ID "${dto.userId}" no existe.`);
    }

    const proyect = await this.proyectRepository.findOne({ where: { id: dto.proyectId } });
    if (!proyect) {
      throw new NotFoundException(`El proyecto con ID "${dto.proyectId}" no existe.`);
    }

    const exists = await this.userProyectRepository.findOne({
      where: {
        user:   { id: dto.userId },
        proyect:{ id: dto.proyectId },
      },
    });
    if (exists) {
      throw new ConflictException('El usuario ya está asignado a este proyecto.');
    }

    const relation = this.userProyectRepository.create({ user, proyect, role });
    const saved = await this.userProyectRepository.save(relation);

    return new UserProyectResponseDTO(saved);
  }


  async listAllUserByProyect(proyectId: number): Promise<UserByProyectResponseDTO[]> {
    const rows = await this.userProyectRepository.find({
      where: { proyect: { id: proyectId } },
      relations: ['user', 'proyect', 'role'],
    });

    if (!rows.length) {
      throw new NotFoundException(`No se encontraron usuarios para el proyecto con ID "${proyectId}".`);
    }

    return rows.map(
      (up) =>
        new UserByProyectResponseDTO({
          userProyectId: up.id,  
          userId: up.user.id,
          userName: up.user.username,
          email: up.user.email,
          role: up.role.name,
        }),
    );
  }
  
async listAllUserNotInProyect(proyectId: number): Promise<UserNotInProyectResponseDTO[]> {
  const users = await this.userRepository
    .createQueryBuilder('user')
    .where(qb => {
      const sq = qb.subQuery()
        .select('up.user_id')
        .from(UserProyect, 'up')
        .where('up.proyect_id = :proyectId')
        .getQuery();
      return `user.id NOT IN ${sq}`;
    })
    .setParameter('proyectId', proyectId)
    .getMany();

  return users.map(u => new UserNotInProyectResponseDTO(u));
}


  /**
   * Lista proyectos a los que pertenece un usuario (con su rol en cada uno).
   */
  async listAllProyectsByUser(userId: number): Promise<ProyectByUserResponseDTO[]> {
    const rows = await this.userProyectRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'proyect', 'role', 'proyect.category'],
    });

    if (!rows.length) {
      throw new NotFoundException(`No se encontraron proyectos para el usuario con ID "${userId}".`);
    }

    return rows.map(
      (up) =>
        new ProyectByUserResponseDTO({
          proyectId: up.proyect.id,
          proyectName: up.proyect.name,
          categoryName: up.proyect.category?.name,
          role: up.role.name,
        }),
    );
  }

  /**
   * Elimina una relación user_proyect por su ID.
   */
  async deleteUserProyect(id: number): Promise<{ message: string }> {
  try {
    const result = await this.userProyectRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`UserProyect con ID ${id} no encontrado.`);
    }

    return { message: 'UserProyect eliminado correctamente.' };

  } catch (error) {

    // Error por violación de llave foránea (tiene tareas asignadas)
    if (error.code === '23503') {
      throw new ConflictException(
        'No se puede eliminar este integrante porque tiene tareas asignadas.'
      );
    }

    // Otros errores no controlados
    throw error;
  }
}


  /**
   * Cambia el rol de un usuario dentro de un proyecto.
   */
  async changeRoleByIdUserandIdProyect(
    userId: number,
    proyectId: number,
    dto: UserProyectRequestDTO,
  ): Promise<UserProyectResponseDTO> {
    const relation = await this.userProyectRepository.findOne({
      where: {
        user: { id: userId },
        proyect: { id: proyectId },
      },
      relations: ['user', 'proyect', 'role'],
    });

    if (!relation) {
      throw new NotFoundException(
        `No se encontró la relación entre el usuario con ID "${userId}" y el proyecto con ID "${proyectId}".`,
      );
    }

    const newRole = await this.roleRepository.findOne({ where: { id: dto.roleId } });
    if (!newRole) {
      throw new NotFoundException(`El rol con ID "${dto.roleId}" no existe.`);
    }

    relation.role = newRole;
    const updated = await this.userProyectRepository.save(relation);
    return new UserProyectResponseDTO(updated);
  }
}
