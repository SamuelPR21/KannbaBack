import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Proyect } from "./proyect.entity";
import { ProyectService } from "./services/proyect.services";
import { ProyectController } from "./controller/proyect.controller";
import { Category } from "src/category/category.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Proyect, Category])],
    controllers: [ProyectController],
    providers: [ProyectService],
    exports: [ProyectService, TypeOrmModule.forFeature([Proyect])],
})
export class ProyectModule {}

