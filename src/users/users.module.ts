import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./users.entity";
import { AuthModule } from "../auth/auth.module";
import { TaskModule } from "src/task/task.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, TaskModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
