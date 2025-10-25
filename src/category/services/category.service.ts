import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Category } from "../category.entity";
import { CategoryRequestDTO } from "../DTO/categoryRequest.dto";
import { CategoryResponseDTO } from "../DTO/categoryResponse.dto";


@Injectable()
export class CategoryService{
   constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
   ) {}

   async getCategories(): Promise<CategoryResponseDTO[]> {
        return await this.categoryRepository.find();
   }

    async getCategoryById(id: number): Promise<CategoryResponseDTO> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Categoria with ID ${id} not encontrada`);
        }
        return category;
    }

    async createCategory(categoryRequestDTO: CategoryRequestDTO): Promise<CategoryResponseDTO> {
        const newCategory = this.categoryRepository.create(categoryRequestDTO);
        return await this.categoryRepository.save(newCategory);
    }


}

