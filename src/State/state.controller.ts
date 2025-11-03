import { Body, Controller, Get, Post } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './DTO/create-state.dto';

@Controller('/state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  async create(@Body() dto: CreateStateDto) {
    const state = await this.stateService.createState(dto);
    return { message: 'Estado registrado correctamente', state };
  }


  @Get()
  async getAll() {
    const states = await this.stateService.getAllStates();
    return { states };
  }
}
