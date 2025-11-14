import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskHistory } from "./task-history.entity";
import { TaskHistoryService } from "./task-history.service";
import { TaskHistoryController } from "./task-history.controller";
import {State} from "src/State/state.entity";
import {TaskPersonal} from "src/task/Entities/task-personal.entity";
import {TaskProyect} from "src/task/Entities/task-proyect.entity";



@Module({
    imports: [TypeOrmModule.forFeature([TaskHistory, State, TaskPersonal, TaskProyect])],
    controllers: [TaskHistoryController],
    providers: [TaskHistoryService],
    exports: [TaskHistoryService],

})

export class TaskHistoryModule {}