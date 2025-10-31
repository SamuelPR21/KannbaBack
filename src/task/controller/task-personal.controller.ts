import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskPersonalService } from '../service/task-personal.service';
import { CreateTaskPersonalDto } from '../DTO/taskPersonal/create-task-personal.dto';
import { UpdateTaskPersonalDto } from '../DTO/taskPersonal/update-task-personal.dto';

@Controller('task-personal')
export class TaskPersonalController {
  constructor(private readonly taskService: TaskPersonalService) {}

  //  POST /task-personal
  @Post()
  async create(@Body() dto: CreateTaskPersonalDto) {
    const task = await this.taskService.createTask(dto);
    return { message: 'Tarea personal creada correctamente', task };
  }

  //  GET /task-personal
  @Get()
  async getAll() {
    const tasks = await this.taskService.getAllTasks();
    return { tasks };
  }

  //  GET /task-personal/:id
  @Get(':id')
  async getById(@Param('id') id: number) {
    const task = await this.taskService.getTaskById(id);
    return { task };
  }

  //  PUT /task-personal/:id
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTaskPersonalDto) {
    const updated = await this.taskService.updateTask(id, dto);
    return { message: 'Tarea actualizada correctamente', updated };
  }

  // DELETE /task-personal/:id
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.taskService.deleteTask(id);
    return { message: 'Tarea eliminada correctamente' };
  }
}
