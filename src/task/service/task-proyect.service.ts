import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskProyect } from './../Entities/task-proyect.entity';
import { UserProyect } from '../../user_Proyetc/userProyect.entity';
import { State } from '../../State/state.entity';
import { CreateTaskProyectDto } from '../DTO/taskProeyct/create-task-proyect.dto';
import { UpdateTaskProyectDto } from '../DTO/taskProeyct/update-task-proyect.dto';
import { CreateTaskProyectResponseDTO } from '../DTO/taskProeyct/create-task-proyect.response.dto';
import { ListTaskProyectItemDTO } from '../DTO/taskProeyct/list-task-proyect.response.dto';
import { DetailTaskProyectResponseDTO } from '../DTO/taskProeyct/detail-task-proyect.response.dto';
import { UpdateTaskProyectResponseDTO } from '../DTO/taskProeyct/update-task-proyect.response.dto';

@Injectable()
export class TaskProyectService {
  constructor(
    @InjectRepository(TaskProyect)
    private readonly taskProyectRepository: Repository<TaskProyect>,
    @InjectRepository(UserProyect)
    private readonly userProyectRepository: Repository<UserProyect>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {}

  //Helpers de carga con relaciones
  private async loadTaskWithRelationsOrFail(taskId: number) {
    const task = await this.taskProyectRepository.findOne({
      where: { id: taskId },
      relations: ['state', 'userProyect', 'userProyect.user', 'userProyect.role', 'userProyect.proyect'],
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return task;
  }

  private ensureSameProjectOrThrow(userProyect: UserProyect, proyectId: number) {
    if (!userProyect?.proyect?.id || userProyect.proyect.id !== proyectId) {
      throw new BadRequestException('El responsable no pertenece a este proyecto');
    }
  }

  //Mapeadores a DTOresponse
  private toCreateResponse(task: TaskProyect): CreateTaskProyectResponseDTO {
    return new CreateTaskProyectResponseDTO({
      taskId: task.id,
      proyectId: task.userProyect.proyect.id,
      name: task.name,
      description: task.description,
      state: task.state.name as any,
      responsible: {
        userProyectId: task.userProyect.id,
        userId: task.userProyect.user.id,
        username: task.userProyect.user.username,
        role: task.userProyect.role.name,
      },
    });
  }

  private toDetailResponse(task: TaskProyect): DetailTaskProyectResponseDTO {
    return new DetailTaskProyectResponseDTO({
      taskId: task.id,
      proyectId: task.userProyect.proyect.id,
      name: task.name,
      description: task.description,
      state: task.state.name as any,
      responsible: {
        userProyectId: task.userProyect.id,
        userId: task.userProyect.user.id,
        username: task.userProyect.user.username,
        role: task.userProyect.role.name,
      },
    });
  }

  private toUpdateResponse(task: TaskProyect): UpdateTaskProyectResponseDTO {
    return new UpdateTaskProyectResponseDTO({
      taskId: task.id,
      proyectId: task.userProyect.proyect.id,
      name: task.name,
      description: task.description,
      state: task.state.name as any,
      responsible: {
        userProyectId: task.userProyect.id,
        userId: task.userProyect.user.id,
        username: task.userProyect.user.username,
        role: task.userProyect.role.name,
      },
    });
  }

  private toListItem(task: TaskProyect): ListTaskProyectItemDTO {
    return new ListTaskProyectItemDTO({
      taskId: task.id,
      name: task.name,
      state: task.state.name as any,
      responsible: {
        userProyectId: task.userProyect.id,
        username: task.userProyect.user.username,
      },
    });
  }


  // Crear
  async create(proyectId: number, dto: CreateTaskProyectDto): Promise<CreateTaskProyectResponseDTO> {
    const userProj = await this.userProyectRepository.findOne({
      where: { id: dto.userProyectId },
      relations: ['proyect', 'user', 'role'],
    });
    if (!userProj) throw new NotFoundException('Responsable no encontrado');
    this.ensureSameProjectOrThrow(userProj, proyectId);

    const state = await this.stateRepository.findOne({ where: { id: dto.stateId } });
    if (!state) throw new NotFoundException('Estado no encontrado');

    // Crear
    const task = this.taskProyectRepository.create({
      name: dto.name,
      description: dto.description,
      userProyect: userProj,
      state,
    });
    const saved = await this.taskProyectRepository.save(task);

    const full = await this.loadTaskWithRelationsOrFail(saved.id);
    return this.toCreateResponse(full);
  }

  // Listar (opcionalmente por estado)
  async listByProyect(proyectId: number, stateName?: 'BACKLOG' | 'TO_DO' | 'DOING' | 'DONE'): Promise<ListTaskProyectItemDTO[]> {
    const qb = this.taskProyectRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.state', 'state')
      .leftJoinAndSelect('t.userProyect', 'up')
      .leftJoinAndSelect('up.user', 'u')
      .leftJoinAndSelect('up.proyect', 'p')
      .where('p.id = :pid', { pid: proyectId });

    if (stateName) qb.andWhere('state.name = :s', { s: stateName });

    const tasks = await qb.getMany(); 
    return tasks.map((t) => this.toListItem(t));
  }

  // Detalle
  async getById(proyectId: number, taskId: number): Promise<DetailTaskProyectResponseDTO> {
    const task = await this.loadTaskWithRelationsOrFail(taskId);
    this.ensureSameProjectOrThrow(task.userProyect, proyectId);
    return this.toDetailResponse(task);
  }

  // Patch
  async patch(proyectId: number, taskId: number, dto: UpdateTaskProyectDto): Promise<UpdateTaskProyectResponseDTO> {
    const task = await this.loadTaskWithRelationsOrFail(taskId);
    this.ensureSameProjectOrThrow(task.userProyect, proyectId);

    if (dto.name !== undefined) task.name = dto.name;
    if (dto.description !== undefined) task.description = dto.description;

    if (dto.userProyectId !== undefined) {
      const newUP = await this.userProyectRepository.findOne({
        where: { id: dto.userProyectId },
        relations: ['proyect', 'user', 'role'],
      });
      if (!newUP) throw new NotFoundException('Nuevo responsable no encontrado');
      this.ensureSameProjectOrThrow(newUP, proyectId);
      task.userProyect = newUP;
    }

    if (dto.stateId !== undefined) {
      const newState = await this.stateRepository.findOne({ where: { id: dto.stateId } });
      if (!newState) throw new NotFoundException('Nuevo estado no encontrado');
      task.state = newState;
    }

    const saved = await this.taskProyectRepository.save(task);
    const full = await this.loadTaskWithRelationsOrFail(saved.id);
    return this.toUpdateResponse(full);
  }

  // Eliminar (puedes mantener vacío el body; no necesita DTOresponse)
  async remove(proyectId: number, taskId: number): Promise<{ message: string }> {
    const task = await this.loadTaskWithRelationsOrFail(taskId);
    this.ensureSameProjectOrThrow(task.userProyect, proyectId);
    await this.taskProyectRepository.remove(task);
    return { message: 'Tarea eliminada correctamente' };
  }
}
