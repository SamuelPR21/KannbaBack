import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./DTO/create-user.dto";
import { LoginUserDto } from "./DTO/login-user.dto";
import { UpdateUserDto } from "./DTO/update-user.dto";
import { UserProgressResponseDTO } from "./DTO/user-progress-response.dto";

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.register(dto);
    return res.json({ message: 'Usuario registrado correctamente', user });
  }

  @Post('/login')
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const { token, user} = await this.usersService.login(dto);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("Access-control-Expose-Headers", "Authorization");
    return res.json({message: "Inicio de sesión exitoso", user});
  }

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    return { user };
  }

  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.update(id, dto);
    return { message: 'Usuario actualizado', updated };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    await this.usersService.delete(id);
    return { message: 'Usuario eliminado correctamente' };
  }

  @Get('/:id/progress')
  async getUserProgress(@Param('id') userId:number, @Query('state')state: string): Promise<UserProgressResponseDTO> {
    const stateName = state?.toUpperCase() || 'DONE';
    return this.usersService.getUserProgress(userId, stateName);
  }
}
