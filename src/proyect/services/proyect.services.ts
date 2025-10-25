import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Proyect } from "../proyect.entity";
import { ProyectRequestDTO } from "../DTO/proyectRequest.dto";
import { ProyectResponseDTO } from "../DTO/proyectResponse.dto";
import { Category } from "src/category/category.entity";

@Injectable()
export class ProyectService{
    constructor(
         @InjectRepository(Proyect)
         private readonly proyectRepository: Repository<Proyect>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
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

    async createProyect(proyectRequestDTO: ProyectRequestDTO): Promise<ProyectResponseDTO>{
        const category = await this.categoryRepository.findOne({
            where: { id: proyectRequestDTO.categoryId },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${proyectRequestDTO.categoryId} not found`);
        }

        const newProyect = this.proyectRepository.create({
            name: proyectRequestDTO.name,
            category: category,
        });

        const savedProyect = await this.proyectRepository.save(newProyect);
        return{
            id: savedProyect.id,
            name: savedProyect.name,
            categoryId: category.id,
        }
    }

    async deleteProyect(id: number): Promise<void> {
        const result = await this.proyectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Proyect with ID ${id} not found`);
        }
        return;
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