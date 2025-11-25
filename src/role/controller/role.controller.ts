import { Controller, Post, Body, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { RoleRequestDTO } from '../DTO/roleRequestDTO.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() dto: RoleRequestDTO) {
    return this.roleService.createRole(dto);
  }
  
  @Delete(':id')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
  
  @Get()
  getAllRoles() {
    return this.roleService.findAll();
  }

  @Get(':id')
  getRoleById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findRolById(id);
  }
  
}
