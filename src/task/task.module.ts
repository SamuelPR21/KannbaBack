import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskPersonal } from './Entities/task-personal.entity';
import { TaskProyect } from './Entities/task-proyect.entity';
import { User } from '../users/users.entity';
import { State } from '../State/state.entity';
import { UserProyect } from '../user_Proyetc/userProyect.entity';
import { TaskPersonalController } from './controller/task-personal.controller';
import { TaskPersonalService } from './service/task-personal.service';
import { TaskProyectController } from './controller/task-proyect.controller';
import { TaskProyectService } from './service/task-proyect.service';
import { ProyectRoleGuard } from '../common/guards/proyect-role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskPersonal,
      TaskProyect,
      User,
      State,
      UserProyect, // necesario para el guard y las validaciones
    ]),
  ],
  controllers: [TaskPersonalController, TaskProyectController],
  providers: [TaskPersonalService, TaskProyectService, ProyectRoleGuard],
  exports: [TaskPersonalService, TaskProyectService],
})
export class TaskModule {}
