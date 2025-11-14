import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not, IsNull } from "typeorm";
import { TaskHistory } from "./task-history.entity";
import { TaskPersonal } from "src/task/Entities/task-personal.entity";
import { TaskProyect } from "src/task/Entities/task-proyect.entity";
import { State } from "src/State/state.entity";
import { CreateTaskHistoryDto } from "./task-history.dto";

@Injectable()
export class TaskHistoryService {

    constructor(
        @InjectRepository(TaskHistory)
        private readonly historyRepo: Repository<TaskHistory>,
        @InjectRepository(State)
        private readonly stateRepo: Repository<State>,
        @InjectRepository(TaskPersonal)
        private readonly personalRepo: Repository<TaskPersonal>,
        @InjectRepository(TaskProyect)
        private readonly proyectRepo: Repository<TaskProyect>,
      ) {}
    
      async registerChange(dto: CreateTaskHistoryDto) {
        const { taskPersonalId, taskProyectId, oldStateId, newStateId } = dto;
    
        const oldState = await this.stateRepo.findOne({ where: { id: oldStateId } });
        const newState = await this.stateRepo.findOne({ where: { id: newStateId } });
        if (!oldState || !newState) throw new NotFoundException('Estado inválido');
    
        let taskPersonal: TaskPersonal | null = null;
        let taskProyect: TaskProyect | null = null;
    
        if (taskPersonalId) {
          taskPersonal = await this.personalRepo.findOne({ where: { id: taskPersonalId } });
          if (!taskPersonal) throw new NotFoundException('Tarea personal no encontrada');
        }
    
        if (taskProyectId) {
          taskProyect = await this.proyectRepo.findOne({ where: { id: taskProyectId } });
          if (!taskProyect) throw new NotFoundException('Tarea de proyecto no encontrada');
        }
    
        const record = this.historyRepo.create({
          taskPersonal: taskPersonal ?? undefined,
          taskProyect: taskProyect ?? undefined,
          previousState: oldState,
          newState,
        });
    
        return await this.historyRepo.save(record);
      }
    
      async getAll() {
        return await this.historyRepo.find({
          relations: ['taskPersonal', 'taskProyect', 'previousState', 'newState'],
          order: { changedAt: 'DESC' },
        });
      }
    
      // Obtener por tipo de tarea
      async getByType(type: 'personal' | 'proyect') {
        if (type === 'personal') {
          return await this.historyRepo.find({
            where: { taskPersonal: { id: Not(IsNull()) } },
            relations: ['taskPersonal', 'previousState', 'newState'],
            order: { changedAt: 'DESC' },
          });
        } else {
          return await this.historyRepo.find({
            where: { taskProyect: { id: Not(IsNull()) } },
            relations: ['taskProyect', 'previousState', 'newState'],
            order: { changedAt: 'DESC' },
          });
        }
      }
    }


