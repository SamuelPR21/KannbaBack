import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from "typeorm";
import { Proyect } from "../proyect.entity";
import { ProyectRequestDTO } from "../DTO/proyectRequest.dto";
import { ProyectResponseDTO } from "../DTO/proyectResponse.dto";
import { Category } from "src/category/category.entity";
import { User } from "src/users/users.entity";
import { Role } from "src/role/role.entity";
import { UserProyect } from "src/user_Proyetc/userProyect.entity";
import { TaskProyect } from "src/task/Entities/task-proyect.entity";

@Injectable()
export class ProyectService{
    constructor(
         @InjectRepository(Proyect)
         private readonly proyectRepository: Repository<Proyect>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(UserProyect)
        private readonly userProyectRepository: Repository<UserProyect>,
        @InjectRepository(TaskProyect)
        private readonly taskProyectRepository: Repository<TaskProyect>,
        private readonly dataSource: DataSource,
    ) {}

    async getProyets(): Promise<ProyectResponseDTO[]> {
        const proyets = await this.proyectRepository.find({
            relations:['category']
        });

        return proyets.map((proyect) =>({
            id: proyect.id,
            name: proyect.name,
            categoryId: proyect.category.id
        }))
    }

    async getProyectById(id: number): Promise<ProyectResponseDTO> {
        const proyect = await this.proyectRepository.findOne({ 
            where: { id },
            relations: ['category'],
        });

        if (!proyect) {
            throw new NotFoundException(`Proyect with ID ${id} not encontrada`);
        }

        return{
            id: proyect.id,
            name: proyect.name,
            categoryId: proyect.category.id
        }
    }

    async createProyect(proyectRequestDTO: ProyectRequestDTO, userId: number): Promise<ProyectResponseDTO>{

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const category = await this.categoryRepository.findOne({
                where: { id: proyectRequestDTO.categoryId },
            });
    
            if (!category) {
                throw new NotFoundException(`Category with ID ${proyectRequestDTO.categoryId} not found`);
            }

            const newProyect = queryRunner.manager.create(Proyect,{
                name: proyectRequestDTO.name,
                category,
            })
            
            const savedProyect = await queryRunner.manager.save(newProyect);

            const user = await queryRunner.manager.findOne(User,{
                where: { id: userId },
            })

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
            }

            const  managerRole = await queryRunner.manager.findOne(Role,{where: { name: 'MANAGER' }});
            if (!managerRole) {
                throw new NotFoundException('Rol MANAGER no configurado');
            }

            const userProyect = queryRunner.manager.create(UserProyect,{
                user,
                proyect: savedProyect,
                role: managerRole,
            })

            await queryRunner.manager.save(userProyect);

            await queryRunner.commitTransaction();

            return {
                id: savedProyect.id,
                name: savedProyect.name,
                categoryId: category.id,
            }
            
        }catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }finally{
            await queryRunner.release();
        }
        
    }

async deleteProyect(id: number): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const proyect = await queryRunner.manager.findOne(Proyect, { where: { id } });

        if (!proyect) {
            throw new NotFoundException(`El proyecto con ID ${id} no existe.`);
        }

        const userProyects = await queryRunner.manager.find(UserProyect, {
            where: { proyect: { id } },
            relations: ['taskProyect'],
        });

        for (const up of userProyects) {
            await queryRunner.manager.delete("task_proyect", {
                userProyect: { id: up.id },
            });
        }

        await queryRunner.manager.delete(UserProyect, { proyect: { id } });

        await queryRunner.manager.delete(Proyect, { id });

        await queryRunner.commitTransaction();

        return { message: `Proyecto con ID ${id} eliminado correctamente.` };

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}



    async updateProyect(id: number, proyectRequestDTO: ProyectRequestDTO): Promise<ProyectResponseDTO> {
        const proyect = await this.proyectRepository.findOne({ where: { id }, relations: ['category'],});
        const category = await this.categoryRepository.findOne({ where: { id: proyectRequestDTO.categoryId },});

        if (!proyect) {
            throw new NotFoundException(`Proyect with ID ${id} not found`);
        }
        if (!category) {
            throw new NotFoundException(`Category with ID ${proyectRequestDTO.categoryId} not found`);
        }

        proyect.name = proyectRequestDTO.name;
        proyect.category = category;

       
        const updatedProyect = await this.proyectRepository.save(proyect);

        return {
            id: updatedProyect.id,
            name: updatedProyect.name,
            categoryId: updatedProyect.category.id,
        };
    }

}