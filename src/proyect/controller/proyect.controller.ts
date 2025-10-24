import { Controller, Get, Post, Param, Body, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { ProyectService } from '../services/proyect.services';
import { ProyectRequestDTO } from '../DTO/proyectRequest.dto';

@Controller('/proyects')        
export class ProyectController {
    constructor (private readonly proyectService: ProyectService) {}

    @Get()
    getAllProyects() {  
        try{
            return this.proyectService.getProyets();
        }catch (error) {
            console.error('Error geting all proyects:', error);
            throw error;
        }
    }

    @Get('/:id')
    getProyectById(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.proyectService.getProyectById(id);
            
        }catch (error) {
            console.error('Error fetching proyect by ID:', error);
            throw error;
        }
    }

    @Post()
    createProyect(@Body() proyectRequestDTO: ProyectRequestDTO) {
        try {
            return this.proyectService.createProyect(proyectRequestDTO);

        }catch (error) {
            console.error('Error creating proyect:', error);
            throw error;
        }
    }

    @Delete('/:id')
    deleteProyect(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.proyectService.deleteProyect(id);
            
        }catch (error) {
            console.error('Error deleting proyect:', error);
            throw error;
        }
    }

    @Patch('/:id')
    updateProyect(@Param ('id', ParseIntPipe) id: number, @Body() proyectRequestDTO: ProyectRequestDTO) {
        try {
            return this.proyectService.updateProyect(id, proyectRequestDTO);
            
        }catch (error) {
            console.error('Error updating proyect:', error);
            throw error;
        }
    }
}
