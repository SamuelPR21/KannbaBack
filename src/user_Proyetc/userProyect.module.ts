import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProyect } from "./userProyect.entity";
import { UserProyectService } from "./services/userProyectService.dto";
import { UserProyectController } from "./controller/userProyect.controller";
import { Role } from "src/role/role.entity";
import { Proyect } from "src/proyect/proyect.entity";
import { User } from "src/users/users.entity";
import { UsersModule } from "src/users/users.module";
import { ProyectModule } from "src/proyect/proyect.module";
import { RolModule } from "src/role/rol.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProyect, Role, Proyect, User]), 
    UsersModule,   
    ProyectModule,
    RolModule
  ],
  controllers: [UserProyectController],
  providers: [UserProyectService],
  exports: [UserProyectService, TypeOrmModule.forFeature([UserProyect])],
})
export class UserProyectModule {}
