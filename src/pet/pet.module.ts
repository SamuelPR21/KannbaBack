import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pet } from "./entities/pet.entity";
import { PetFeed } from "./entities/pet-feed.entity";
import { PetService } from "./services/pet.service";
import { PetController } from "./controller/pet.controller";
import { TaskHistoryModule } from "src/task_history/task-history.module";
import { User } from "src/users/users.entity";
import { TaskHistoryService } from "src/task_history/task-history.service";

@Module({
    imports: [TypeOrmModule.forFeature([Pet, PetFeed, User]), TaskHistoryModule
                ],
    controllers: [PetController],
    providers: [PetService],
    exports: [PetService],
})


export class PetModule {}
