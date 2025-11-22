import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskPersonalService } from '../service/task-personal.service';
import { CreateTaskPersonalDto } from '../DTO/taskPersonal/create-task-personal.dto';
import { UpdateTaskPersonalDto } from '../DTO/taskPersonal/update-task-personal.dto';
import { UserId } from 'src/common/decorator/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import {TaskPersonalMapper} from "../DTO/mapperTaskPersonal/task-personal.mapper";


@Controller('/task-personal')
@UseGuards(JwtAuthGuard)
export class TaskPersonalController {
  constructor(private readonly taskService: TaskPersonalService) {}

  @Post()
  async create(@Body() dto: CreateTaskPersonalDto) {
    const task = await this.taskService.createTask(dto);
    return { message: 'Tarea personal creada correctamente', task };
  }

  @Get()
  async getAll() {
    const tasks = await this.taskService.getAllTasks();
    return { tasks };
  }
  
  @Get('/my-tasks')
  async getByUser(@UserId() userId: number) {
    const tasks = await this.taskService.getTasksByUserId(userId);
    return { tasks: TaskPersonalMapper.toResponseList(tasks) };
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    const task = await this.taskService.getTaskById(id);
    return { task };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateTaskPersonalDto) {
    const updated = await this.taskService.updateTask(id, dto);
    return { message: 'Tarea actualizada correctamente', updated };
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    await this.taskService.deleteTask(id);
    return { message: 'Tarea eliminada correctamente' };
  }

}
