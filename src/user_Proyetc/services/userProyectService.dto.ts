import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProyect } from "../userProyect.entity";
import { UserProyectResponseDTO } from "../DTO/userProyectResponse.dto";
import { UserProyectRequestDTO } from "../DTO/userProyectRequest.dto";


@Injectable()
export class UserProyectService {
    constructor(
        @InjectRepository(UserProyect)
        private readonly userProyectRepository: Repository<UserProyect>,
        
    ){}


//    async createUserProyect(userProyectRequestDTO: UserProyectRequestDTO): Promise<UserProyectResponseDTO> {
  //      const existingUserProyect = await this.userProyectRepository.findOne({
    //        where: { 
    //            proyect: { id: userProyectRequestDTO.proyectId },
     //           user: { id: userProyectRequestDTO.userId },
     //        },
      //  });
       // if (existingUserProyect) {
        //    throw new ConflictException(`El usuario con ID "${userProyectRequestDTO.userId}" ya está asignado al proyecto con ID "${userProyectRequestDTO.proyectId}".`);
       // }

        //const userProyect = this.userProyectRepository.create(userProyectRequestDTO);
    //    const savedUserProyect = await this.userProyectRepository.save(userProyect);
    //    return new UserProyectResponseDTO(savedUserProyect);
    //}


    



}
