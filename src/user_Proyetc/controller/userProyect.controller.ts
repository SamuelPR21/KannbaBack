import {
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Body,
  Controller,
} from "@nestjs/common";
import { UserProyectService } from "../services/userProyectService.services";
import { UserProyectRequestDTO } from "../DTO/userProyectRequest.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ProyectRoleGuard } from "src/common/guards/proyect-role.guard";
import { ProyectRoles } from "src/common/decorator/proyect-role.decorator";
import { AssigUserToProyectDTO } from "../DTO/AssigUserToProyectDTO.dto";
import { UserId } from "../../common/decorator/user-id.decorator";

@Controller("/user-proyect")
@UseGuards(JwtAuthGuard)   // ⬅️ SOLO JWT AQUÍ
export class UserProyectController {
  constructor(private readonly userProyectService: UserProyectService) {}

  // SOLO MANAGER debe asignar usuarios a un proyecto
  @Post()
  @UseGuards(ProyectRoleGuard)
  @ProyectRoles("MANAGER")
  async createUserProyect(@Body() dto: AssigUserToProyectDTO) {
    return this.userProyectService.createUserProyect(dto);
  }

  // ⬅️ ESTE ENDPOINT SE LIBERA: NO REQUIERE ROLE GUARD
  @Get("/listProyect")
  async getProyectsByUserId(@UserId() userId: number) {
    return this.userProyectService.listAllProyectsByUser(userId);
  }

  @Get("/userNot/:proyectId")
  @UseGuards(ProyectRoleGuard)
  async getUsersNotInProyect(
    @Param("proyectId", ParseIntPipe) proyectId: number,
  ) {
    return this.userProyectService.listAllUserNotInProyect(proyectId);
  }

  @Get("/listUser/:proyectId")
  @UseGuards(ProyectRoleGuard)
  @ProyectRoles("MANAGER")
  async getUsersByProyectId(
    @Param("proyectId", ParseIntPipe) proyectId: number,
  ) {
    return this.userProyectService.listAllUserByProyect(proyectId);
  }

  @Delete("/:id")
  @UseGuards(ProyectRoleGuard)
  @ProyectRoles("MANAGER")
  async deleteUserProyect(@Param("id", ParseIntPipe) id: number) {
    return this.userProyectService.deleteUserProyect(id);
  }

  @Patch("/:idUser/:proyectId")
  @UseGuards(ProyectRoleGuard)
  @ProyectRoles("MANAGER")
  async updateUserProyectRole(
    @Param("idUser", ParseIntPipe) idUser: number,
    @Param("proyectId", ParseIntPipe) idProyect: number,
    @Body() dto: UserProyectRequestDTO,
  ) {
    return this.userProyectService.changeRoleByIdUserandIdProyect(
      idUser,
      idProyect,
      dto,
    );
  }
}
