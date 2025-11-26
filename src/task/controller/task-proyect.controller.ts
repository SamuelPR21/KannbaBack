// src/task/task-proyect.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProyectRoleGuard } from 'src/common/guards/proyect-role.guard';
import { ProyectRoles } from 'src/common/decorator/proyect-role.decorator';

import { TaskProyectService } from './../service/task-proyect.service';
import { CreateTaskProyectDto } from '../DTO/taskProeyct/create-task-proyect.dto';
import { UpdateTaskProyectDto } from '../DTO/taskProeyct/update-task-proyect.dto';
import { CreateTaskProyectResponseDTO } from '../DTO/taskProeyct/create-task-proyect.response.dto';
import { ListTaskProyectItemDTO } from '../DTO/taskProeyct/list-task-proyect.response.dto';
import { DetailTaskProyectResponseDTO } from '../DTO/taskProeyct/detail-task-proyect.response.dto';
import { UpdateTaskProyectResponseDTO } from '../DTO/taskProeyct/update-task-proyect.response.dto';

@Controller('proyects/:proyectId/tasks')
@UseGuards(JwtAuthGuard, ProyectRoleGuard)
export class TaskProyectController {
  constructor(private readonly taskService: TaskProyectService) {}

  @Post()
  @ProyectRoles('MANAGER')
  async create(
    @Param('proyectId', ParseIntPipe) proyectId: number,
    @Body() dto: CreateTaskProyectDto,
  ): Promise<CreateTaskProyectResponseDTO> {
    return this.taskService.create(proyectId, dto);
  }

  @Get()
  @ProyectRoles('MANAGER', 'COLABORADOR')
  async list(
    @Param('proyectId', ParseIntPipe) proyectId: number,
    @Query('state') state?: 'BACKLOG' | 'TO_DO' | 'DOING' | 'DONE',
  ): Promise<ListTaskProyectItemDTO[]> {
    return this.taskService.listByProyect(proyectId, state);
  }

  @Get('/:taskId')
  @ProyectRoles('MANAGER', 'COLABORADOR')
  async detail(
    @Param('proyectId', ParseIntPipe) proyectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<DetailTaskProyectResponseDTO> {
    return this.taskService.getById(proyectId, taskId);
  }

  @Patch('/:taskId')
  @ProyectRoles('MANAGER')
  async patch(
    @Param('proyectId', ParseIntPipe) proyectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskProyectDto,
  ): Promise<UpdateTaskProyectResponseDTO> {
    return this.taskService.patch(proyectId, taskId, dto);
  }

  @Delete('/:taskId')
  @ProyectRoles('MANAGER')
  async remove(
    @Param('proyectId', ParseIntPipe) proyectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<{ message: string }> {
    return this.taskService.remove(proyectId, taskId);
  }
}
