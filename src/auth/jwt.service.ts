import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtTokenService {
  private readonly jwtSecret = process.env.JWT_SECRET; // <- sin fallback

  constructor() {
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET no está definido en variables de entorno');
    }
  }

  private readonly expiresIn = '7d';

  generateToken(payload: any): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (e: any) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
