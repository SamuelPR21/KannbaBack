import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Proyect } from "./proyect.entity";
import { ProyectService } from "./services/proyect.services";
import { ProyectController } from "./controller/proyect.controller";
import { Category } from "src/category/category.entity";
import { User } from "src/users/users.entity";
import { Role } from "src/role/role.entity";
import { UserProyect } from "src/user_Proyetc/userProyect.entity";
import { TaskProyect } from "src/task/Entities/task-proyect.entity";
import { UsersModule } from "src/users/users.module";
import { RoleModule } from "src/role/rol.module";
import { UserProyectModule } from "src/user_Proyetc/userProyect.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyect, Category, User, Role, UserProyect, TaskProyect]),
    forwardRef(() => UserProyectModule),
    forwardRef(() => UsersModule),
    RoleModule,
    forwardRef(() => AuthModule), 
  ],
  controllers: [ProyectController],
  providers: [ProyectService],
  exports: [ProyectService],
})
export class ProyectModule {}


