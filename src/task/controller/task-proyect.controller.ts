import { Controller, Get, Param, Query, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { TaskProyectService } from '../service/task-proyect.service';
import { CreateTaskProyectDto } from '../DTO/taskProeyct/create-task-proyect.dto';
import { UpdateTaskProyectDto } from '../DTO/taskProeyct/update-task-proyect.dto';
import { ProyectRoles } from '../../common/decorator/proyect-role.decorator';
import { ProyectRoleGuard } from '../../common/guards/proyect-role.guard'

@Controller('/proyects/:proyectId/tasks')
@UseGuards(ProyectRoleGuard) 
export class TaskProyectController {
  constructor(private readonly service: TaskProyectService) {}

  // MANAGER: Añadir tarea
  @Post()
  @ProyectRoles('MANAGER')
  async create(
    @Param('proyectId') proyectId: number,
    @Body() dto: CreateTaskProyectDto,
  ) {
    const task = await this.service.create(Number(proyectId), dto);
    return { message: 'Tarea creada correctamente', task };
  }

  // MANAGER/COLABORATOR: Listar tareas de un proyecto (con filtro opcional por estado)
  @Get()
  @ProyectRoles('MANAGER', 'COLABORATOR')
  async list(
    @Param('proyectId') proyectId: number,
    @Query('state') state?: string,
  ) {
    const pid = Number(proyectId);
    if (state) {
      const tasks = await this.service.listByProyectAndState(pid, state);
      return { tasks };
    }
    const tasks = await this.service.listByProyect(pid);
    return { tasks };
  }

  // COLABORATOR/MANAGER: Ver info de una tarea del proyecto
  @Get('/:taskId')
  @ProyectRoles('MANAGER', 'COLABORATOR')
  async getById(
    @Param('proyectId') proyectId: number,
    @Param('taskId') taskId: number,
  ) {
    const task = await this.service.getById(Number(proyectId), Number(taskId));
    return { task };
  }

  // MANAGER: Editar tarea (PATCH)
  @Patch('/:taskId')
  @ProyectRoles('MANAGER')
  async patch(
    @Param('proyectId') proyectId: number,
    @Param('taskId') taskId: number,
    @Body() dto: UpdateTaskProyectDto,
  ) {
    const updated = await this.service.patch(Number(proyectId), Number(taskId), dto);
    return { message: 'Tarea actualizada correctamente', updated };
  }

  // MANAGER: Eliminar tarea
  @Delete('/:taskId')
  @ProyectRoles('MANAGER')
  async delete(
    @Param('proyectId') proyectId: number,
    @Param('taskId') taskId: number,
  ) {
    return await this.service.remove(Number(proyectId), Number(taskId));
  }
}
