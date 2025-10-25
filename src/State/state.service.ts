import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './state.entity';
import { CreateStateDto } from './DTO/create-state.dto';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {}

  // Registrar un nuevo estado
  async createState(dto: CreateStateDto) {
    // Validar si el estado ya existe (por nombre)
    const exists = await this.stateRepository.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('El estado ya existe');

    const newState = this.stateRepository.create(dto);
    return await this.stateRepository.save(newState);
  }

  // Listar todos los estados (para pruebas o uso futuro)
  async getAllStates() {
    return await this.stateRepository.find();
  }
}
