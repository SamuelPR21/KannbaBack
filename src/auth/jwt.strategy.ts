import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';

@Injectable()
export class JwtStrategy {
  constructor(private readonly jwtService: JwtTokenService) {}

  validateTokenFromHeader(header: string) {
    if (!header) throw new UnauthorizedException('Falta el token en el encabezado');
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Formato de token inválido');
    return this.jwtService.verifyToken(token); // <- MISMO servicio, MISMO secret
  }
}
