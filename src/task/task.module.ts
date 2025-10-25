import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskPersonal } from './Entities/task-personal.entity';
import { User } from '../users/users.entity';
import { State } from '../State/state.entity';
import { TaskPersonalController } from './task-personal.controller';
import { TaskPersonalService } from './task-personal.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskPersonal, User, State])],
  controllers: [TaskPersonalController],
  providers: [TaskPersonalService],
  exports: [TaskPersonalService],
})
export class TaskModule {}
