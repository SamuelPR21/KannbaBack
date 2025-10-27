import { Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { Body, Controller } from "@nestjs/common";
import { UserProyectService } from "../services/userProyectService.dto";
import { UserProyectRequestDTO } from "../DTO/userProyectRequest.dto";


@Controller('/user-proyect')
export class UserProyectController {
    constructor(private readonly userProyectService: UserProyectService,) 
    {}

    @Post()
    async createUserProyect( @Body() userProyectRequestDTO: UserProyectRequestDTO ){ 
        try{
            return this.userProyectService.createUserProyect(userProyectRequestDTO);
        }catch(err){
            console.error('error durante la creacion de la relacion user-proyect:', err);
            throw err;
        }
   
    }

    @Get('/listUser/:proyectId')
    async getUsersByProyectId(@Param('proyectId', ParseIntPipe) proyectId: number) {
        try {
            return this.userProyectService.listAllUserByProyect(proyectId);
        } catch (err) {
            console.error('Error fetching users by proyect ID:', err);
            throw err;
        }
    }

    @Get('/listProyect/:userId')
    async getProyectsByUserId(@Param('userId', ParseIntPipe) userId: number) {
        try {
            return this.userProyectService.listAllProyectsByUser(userId);
        } catch (err) {
            console.error('Error fetching proyects by user ID:', err);
            throw err;
        }
    }

    @Delete('/:id')
    async deleteUserProyect(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.userProyectService.deleteUserProyect(id);
        } catch (err) {
            console.error('Error deleting user-proyect relation:', err);
            throw err;
        }
    }


    @Patch('/:idUser/:idProyect')
    async updateUserProyectRole(@Param('idUser', ParseIntPipe) idUser: number,
                                @Param('idProyect', ParseIntPipe) idProyect: number,
                                @Body() userProyectRequestDTO: UserProyectRequestDTO) {

        try{
            return this.userProyectService.changeRoleByIdUserandIdProyect(idUser, idProyect, userProyectRequestDTO);
        }catch(err){
            console.error('Error updating user-proyect role:', err);
            throw err;
        }
    }



}