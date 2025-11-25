import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import { CreateUserDto } from "./DTO/create-user.dto";
import { LoginUserDto } from "./DTO/login-user.dto";
import { UserProgressResponseDTO } from "./DTO/user-progress-response.dto";
import { TaskPersonal } from "src/task/Entities/task-personal.entity";
import { TaskProyect } from "src/task/Entities/task-proyect.entity";
import { UpdateUserDto } from "./DTO/update-user.dto";
import * as bcrypt from "bcrypt";
import { JwtTokenService } from "../auth/jwt.service";
import { PetService } from "src/pet/services/pet.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtTokenService: JwtTokenService,

    @InjectRepository(TaskPersonal)
    private readonly taskPersonalRepository: Repository<TaskPersonal>,
    @InjectRepository(TaskProyect)
    private readonly taskProyectRepository: Repository<TaskProyect>,
    private readonly petService: PetService,
  ) {}

  async register(dto: CreateUserDto) {
    const exists = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (exists)
      throw new ConflictException("El nombre de ususario o correo ya está registrado");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
 
    const savedUser = await this.userRepository.save(newUser);

    const pet = await this.petService.createPetForUser(savedUser);
    savedUser.pet = pet;

    return {
      id: savedUser.id,
      username: savedUser.username,
      nameComlpete: savedUser.nameComlpete,
      email: savedUser.email,
      pet: pet.id,
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException("Credenciales inválidas");

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException("Credenciales inválidas");


    const payload = {
      id: user.id,
      username: user.username,
      nameComlpete: user.nameComlpete,
      email: user.email,
      dateOfBirth: user.dateOfBirth,

    };

    const token = this.jwtTokenService.generateToken(payload);

    const { password, ...userData } = user;
    return { token, user: userData };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("Usuario no encontrado");
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    const updated = await this.userRepository.save(user);
    return updated;
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  async getUserProgress(userId: number, stateName: string): Promise<UserProgressResponseDTO> {
    const personal = await this.taskPersonalRepository
      .createQueryBuilder("task")
      .leftJoin("task.state", "state")
      .select('COUNT(*)', 'total')
      .addSelect(
        `SUM(CASE WHEN state.name = :stateName THEN 1 ELSE 0 END)`,
        'matching',
      )  
      .where("task.user_id = :userId", { userId })
      .setParameter('stateName', stateName)
      .getRawOne();
    
    const project = await this.taskProyectRepository
      .createQueryBuilder('task')
      .leftJoin('task.state', 'state')
      .leftJoin('task.userProyect', 'userProyect')
      .leftJoin('userProyect.user', 'user')      
      .select('COUNT(*)', 'total')
      .addSelect(
        `SUM(CASE WHEN state.name = :stateName THEN 1 ELSE 0 END)`,
        'matching',
      )
      .where('user.id = :userId', { userId })
      .setParameter('stateName', stateName)
      .getRawOne();

    const totalTasks = parseInt(personal.total) + parseInt(project.total);
    const matchingTasks = parseInt(personal.matching) + parseInt(project.matching);

    const progressPercentage =
      totalTasks === 0 ? 0 : (matchingTasks / totalTasks) * 100;

    return {
      state: stateName,
      totalTasks,
      matchingTasks,
      progressPercentage: Math.round(progressPercentage),
    }
  }
  

}
