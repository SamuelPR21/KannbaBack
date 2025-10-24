import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryRequestDTO } from '../DTO/categoryRequest.dto';

@Controller('/categories')
export class CategoryController {
    constructor (private readonly categoryService: CategoryService) {}

    @Get()
    getAllCategories() {
        return this.categoryService.getCategories();
    }

    @Get('/:id')
    getCategoryById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getCategoryById(id);
    }

    @Post()
    createCategory(@Body() categoryRequestDTO: CategoryRequestDTO) {
        return this.categoryService.createCategory(categoryRequestDTO);
    }

}