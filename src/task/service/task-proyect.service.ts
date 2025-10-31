import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskProyect } from '../Entities/task-proyect.entity';
import { State } from '../../State/state.entity';
import { UserProyect } from '../../user_Proyetc/userProyect.entity';
import { CreateTaskProyectDto } from '../DTO/taskProeyct/create-task-proyect.dto';
import { UpdateTaskProyectDto } from '../DTO/taskProeyct/update-task-proyect.dto';

@Injectable()
export class TaskProyectService {
  constructor(
    @InjectRepository(TaskProyect)
    private readonly taskProyectRepo: Repository<TaskProyect>,
    @InjectRepository(UserProyect)
    private readonly userProyectRepo: Repository<UserProyect>,
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
  ) {}

  // Validar que el userProyect pertenezca al proyectId
  private async validateUserProyectInProyect(userProyectId: number, proyectId: number) {
    const up = await this.userProyectRepo.findOne({
      where: { id: userProyectId },
      relations: ['proyect', 'user', 'role'],
    });
    if (!up) throw new NotFoundException('Responsable (user_proyect) no encontrado');
    if (up.proyect.id !== proyectId) {
      throw new BadRequestException('El responsable no pertenece a este proyecto');
    }
    return up;
    }

  // Crear tarea (MANAGER)
  async create(proyectId: number, dto: CreateTaskProyectDto) {
    const responsable = await this.validateUserProyectInProyect(dto.userProyectId, proyectId);

    const state = await this.stateRepo.findOne({ where: { id: dto.stateId } });
    if (!state) throw new NotFoundException('Estado no encontrado');

    const task = this.taskProyectRepo.create({
      name: dto.name,
      description: dto.description,
      userProyect: responsable,
      state,
    });

    const saved = await this.taskProyectRepo.save(task);
    // devolver con relaciones básicas
    return this.getById(proyectId, saved.id);
  }

  // Listar tareas de un proyecto (MANAGER/COLABORATOR)
  async listByProyect(proyectId: number) {
    return await this.taskProyectRepo.find({
      where: { userProyect: { proyect: { id: proyectId } } },
      relations: ['userProyect', 'userProyect.user', 'userProyect.role', 'state'],
      order: { id: 'ASC' },
    });
  }

  // Filtrar por estado (por nombre del enum) (MANAGER/COLABORATOR)
  async listByProyectAndState(proyectId: number, stateName: string) {
    // validar enum del State
    const valid = ['BACKLOG', 'TO_DO', 'DOING', 'DONE'];
    if (!valid.includes(stateName)) {
      throw new BadRequestException('Estado inválido. Use: BACKLOG | TO_DO | DOING | DONE');
    }

    return await this.taskProyectRepo.find({
      where: {
        userProyect: { proyect: { id: proyectId } },
        state: { name: stateName as any },
      },
      relations: ['userProyect', 'userProyect.user', 'userProyect.role', 'state'],
      order: { id: 'ASC' },
    });
  }

  // Ver detalle de una tarea dentro del proyecto (COLABORATOR/ MANAGER)
  async getById(proyectId: number, taskId: number) {
    const task = await this.taskProyectRepo.findOne({
      where: { id: taskId },
      relations: ['userProyect', 'userProyect.proyect', 'userProyect.user', 'userProyect.role', 'state'],
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.userProyect.proyect.id !== proyectId) {
      throw new NotFoundException('La tarea no pertenece a este proyecto');
    }
    return task;
  }

  // Editar (PATCH) (MANAGER)
  async patch(proyectId: number, taskId: number, dto: UpdateTaskProyectDto) {
    const task = await this.getById(proyectId, taskId);

    if (dto.name !== undefined) task.name = dto.name;
    if (dto.description !== undefined) task.description = dto.description;

    if (dto.userProyectId !== undefined) {
      const responsable = await this.validateUserProyectInProyect(dto.userProyectId, proyectId);
      task.userProyect = responsable;
    }

    if (dto.stateId !== undefined) {
      const state = await this.stateRepo.findOne({ where: { id: dto.stateId } });
      if (!state) throw new NotFoundException('Estado no encontrado');
      task.state = state;
    }

    await this.taskProyectRepo.save(task);
    return this.getById(proyectId, taskId);
  }

  // Eliminar (MANAGER)
  async remove(proyectId: number, taskId: number) {
    const task = await this.getById(proyectId, taskId);
    await this.taskProyectRepo.remove(task);
    return { message: 'Tarea eliminada correctamente' };
  }
}
