// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from "./category/category.module";
import { UsersModule } from './users/users.module';
import { StateModule } from './State/state.module';
import { TaskModule } from './task/task.module';
import { ProyectModule } from "./proyect/proyect.module";
import { RolModule } from './role/rol.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module'; // ⬅️ IMPORTA ESTO

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CategoryModule,
    UsersModule,
    StateModule,
    TaskModule,
    ProyectModule,
    RolModule,
    AuthModule, 
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
