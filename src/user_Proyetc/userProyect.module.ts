import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProyect } from "./userProyect.entity";
import { UserProyectService } from "./services/userProyectService.services";
import { UserProyectController } from "./controller/userProyect.controller";
import { Role } from "src/role/role.entity";
import { Proyect } from "src/proyect/proyect.entity";
import { User } from "src/users/users.entity";
import { TaskProyect } from "src/task/Entities/task-proyect.entity";   // 👈 IMPORTANTE

import { UsersModule } from "src/users/users.module";
import { ProyectModule } from "src/proyect/proyect.module";
import { RoleModule } from "src/role/rol.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProyect,
      Role,
      Proyect,
      User,
      TaskProyect,   // 👈 AGREGADO PARA SOLUCIONAR EL ERROR
    ]),

    forwardRef(() => UsersModule),
    forwardRef(() => ProyectModule),
    RoleModule,
    forwardRef(() => AuthModule),
  ],

  controllers: [UserProyectController],
  providers: [UserProyectService],
  exports: [UserProyectService, TypeOrmModule],
})
export class UserProyectModule {}
