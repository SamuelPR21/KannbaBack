import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskPersonal } from '../Entities/task-personal.entity';
import { User } from '../../users/users.entity';
import { State } from '../../State/state.entity';
import { CreateTaskPersonalDto } from '../DTO/taskPersonal/create-task-personal.dto';
import { UpdateTaskPersonalDto } from '../DTO/taskPersonal/update-task-personal.dto';

@Injectable()
export class TaskPersonalService {
  constructor(
    @InjectRepository(TaskPersonal)
    private readonly taskRepository: Repository<TaskPersonal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {}

  //  Crear tarea
  async createTask(dto: CreateTaskPersonalDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const state = await this.stateRepository.findOne({ where: { id: dto.stateId } });
    if (!state) throw new NotFoundException('Estado no encontrado');

    const task = this.taskRepository.create({
      name: dto.name,
      description: dto.description,
      user,
      state,
    });

    return await this.taskRepository.save(task);
  }

  //  Obtener todas las tareas
  async getAllTasks() {
    return await this.taskRepository.find({
      relations: ['user', 'state'],
    });
  }

  //  Obtener tarea por ID
  async getTaskById(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'state'],
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return task;
  }

  //  Actualizar tarea
  async updateTask(id: number, dto: UpdateTaskPersonalDto) {
    const task = await this.getTaskById(id);

    if (dto.name) task.name = dto.name;
    if (dto.description) task.description = dto.description;

    if (dto.stateId) {
      const state = await this.stateRepository.findOne({ where: { id: dto.stateId } });
      if (!state) throw new NotFoundException('Estado no encontrado');
      task.state = state;
    }

    return await this.taskRepository.save(task);
  }

  //  Eliminar tarea
  async deleteTask(id: number) {
    const task = await this.getTaskById(id);
    return await this.taskRepository.remove(task);
  }
}
