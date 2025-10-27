import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const path = req.route?.path || '';
    if (path.includes('/users/register') || path.includes('/users/login')) return true;

    const header = req.headers['authorization'];
    const payload = this.jwtStrategy.validateTokenFromHeader(header);
    req.user = payload; 
    return true;
  }
}
