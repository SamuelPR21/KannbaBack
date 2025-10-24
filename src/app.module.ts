import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import {CategoryModule} from "./category/category.module";
import {ProyectModule} from "./proyect/proyect.module"


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    CategoryModule,
    ProyectModule,

  ],
})
export class AppModule {}
