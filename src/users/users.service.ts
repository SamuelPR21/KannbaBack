import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import { CreateUserDto } from "./DTO/create-user.dto";
import { LoginUserDto } from "./DTO/login-user.dto";
import { UpdateUserDto } from "./DTO/update-user.dto";
import * as bcrypt from "bcrypt";
import { JwtTokenService } from "../auth/jwt.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtTokenService: JwtTokenService,
  ) {}

  // REGISTRO DE USUARIO
  async register(dto: CreateUserDto) {
    const exists = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (exists)
      throw new ConflictException("El usuario o correo ya está registrado");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  // LOGIN DE USUARIO
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
    };

    const token = this.jwtTokenService.generateToken(payload);

    const { password, ...userData } = user;
    return { token, user: userData };
  }

  // OBTENER USUARIO POR ID
  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("Usuario no encontrado");
    return user;
  }

  // ACTUALIZAR USUARIO
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    const updated = await this.userRepository.save(user);
    return updated;
  }

  // ELIMINAR USUARIO
  async delete(id: number) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
