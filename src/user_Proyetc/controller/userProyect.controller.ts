import { Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { Body, Controller } from "@nestjs/common";
import { UserProyectService } from "../services/userProyectService.services";
import { UserProyectRequestDTO } from "../DTO/userProyectRequest.dto";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProyectRoleGuard } from "src/common/guards/proyect-role.guard";
import { ProyectRoles } from "src/common/decorator/proyect-role.decorator";
import { AssigUserToProyectDTO } from "../DTO/AssigUserToProyectDTO.dto";
import {UserId} from "../../common/decorator/user-id.decorator";


@Controller('/user-proyect')
@UseGuards(JwtAuthGuard, ProyectRoleGuard)
export class UserProyectController {
    constructor(private readonly userProyectService: UserProyectService,) 
    {}

    @Post()
    @ProyectRoles('MANAGER')
    async createUserProyect( @Body() assigUserToProyectDTO: AssigUserToProyectDTO ){ 
        try{
            return this.userProyectService.createUserProyect(assigUserToProyectDTO);
        }catch(err){
            console.error('error durante la creacion de la relacion user-proyect:', err);
            throw err;
        }
   
    }

     @Get('/listProyect')
    async getProyectsByUserId(@UserId() userId: number) {
        try {
            return this.userProyectService.listAllProyectsByUser(userId);
        } catch (err) {
            console.error('Error fetching proyects by user ID:', err);
            throw err;
        }
    }


    @Get('/userNot/:proyectId')
    async getUsersNotInProyect(@Param('proyectId', ParseIntPipe) proyectId: number) {
        try {
            return this.userProyectService.listAllUserNotInProyect(proyectId);
        } catch (err) {
            console.error('Error fetching users not in proyect:', err);
            throw err;
        }
    }

    
    @Get('/listUser/:proyectId')
    @ProyectRoles('MANAGER')
    async getUsersByProyectId(@Param('proyectId', ParseIntPipe) proyectId: number) {
        try {
            return this.userProyectService.listAllUserByProyect(proyectId);
        } catch (err) {
            console.error('Error fetching users by proyect ID:', err);
            throw err;
        }
    }

    @Delete('/:id')
    @ProyectRoles('MANAGER')
    async deleteUserProyect(@Param('id', ParseIntPipe) id: number) {
        try {
            return this.userProyectService.deleteUserProyect(id);
        } catch (err) {
            console.error('Error deleting user-proyect relation:', err);
            throw err;
        }
    }


    @Patch('/:idUser/:proyectId')
    @ProyectRoles('MANAGER')
    async updateUserProyectRole(@Param('idUser', ParseIntPipe) idUser: number,
                                @Param('proyectId', ParseIntPipe) idProyect: number,
                                @Body() userProyectRequestDTO: UserProyectRequestDTO) {

        try{
            return this.userProyectService.changeRoleByIdUserandIdProyect(idUser, idProyect, userProyectRequestDTO);
        }catch(err){
            console.error('Error updating user-proyect role:', err);
            throw err;
        }
    }



}