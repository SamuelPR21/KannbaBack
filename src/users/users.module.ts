import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./users.entity";
import { AuthModule } from "../auth/auth.module";
import { TaskModule } from "src/task/task.module";
import { PetModule } from "src/pet/pet.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, TaskModule, PetModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
