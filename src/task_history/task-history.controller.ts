import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TaskHistoryService } from './task-history.service';
import { CreateTaskHistoryDto } from './task-history.dto';

@Controller('/task-history')
export class TaskHistoryController {
  constructor(private readonly service: TaskHistoryService) {}

  @Post()
  async create(@Body() dto: CreateTaskHistoryDto) {
    return await this.service.registerChange(dto);
  }

  @Get()
  async getAll(@Query('type') type?: 'personal' | 'proyect') {
    if (type) return await this.service.getByType(type);
    return await this.service.getAll();
  }
}
