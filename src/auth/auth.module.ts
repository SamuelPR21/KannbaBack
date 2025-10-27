// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [JwtTokenService, JwtStrategy, JwtAuthGuard],
  exports: [JwtTokenService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
